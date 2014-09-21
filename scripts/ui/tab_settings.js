define([ './toast', './strings', './team', './history', './ranking', './state',
    '../lib/base64', './storage', './options', './opts', './players',
    './tabshandle', '../lib/FileSaver.min' ], function (Toast, Strings, Team, History, Ranking, State, Base64, Storage, Options, Opts, Players, Tabshandle, saveAs) {
  var Tab_Settings, $tab, areas, options, updatepending;

  updatepending = false;

  Tab_Settings = {};
  options = {};
  areas = {};

  function initCSV () {
    areas.csv = {};
    areas.csv.$buttons = $tab.find('.csv button');

    // set csv selection buttons
    areas.csv.$buttons.click(function () {
      var $button = $(this);

      // button contains image. Forward accidental clicks.
      if ($button.prop('tagName') === 'IMG') {
        $button = $button.parent();
      }

      csvupdate($button);
    });
  }

  function csvupdate ($button) {
    var csv, blob;

    csv = [];

    if ($button.hasClass('teams')) {
      csv.push(Team.toCSV());
    }
    if ($button.hasClass('ranking')) {
      csv.push(Ranking.toCSV());
    }
    if ($button.hasClass('history')) {
      csv.push(History.toCSV());
    }

    csv = csv.join('\r\n""\r\n');

    if (csv.length === 0) {
      new Toast(Strings.nodata);
      return;
    }

    try {
      blob = new Blob([ csv ], {
        type : 'application/csv'
      });
      saveAs(blob, 'boules.csv');
    } catch (e) {
      console.error('Blobbing failed');
      new Toast(Strings.savefailed);
    }
  }

  function initSave () {
    areas.save = {};
    areas.save.$button = $tab.find('.save button');

    areas.save.$button.click(saveState);
  }

  function saveState () {
    var save, blob;

    save = State.toBlob();

    try {
      blob = new Blob([ save ], {
        type : 'application/json'
      });
      saveAs(blob, 'boules.json');
    } catch (e) {
      console.error(e);
      new Toast(Strings.savefailed);
    }
  }

  function initLoad () {
    areas.load = {};

    areas.load.$file = $tab.find('.load input.file');

    areas.load.$file.change(function (evt) {
      var reader = new FileReader();
      reader.onerror = loadFileError;
      reader.onabort = loadFileAbort;
      reader.onload = loadFileLoad;

      reader.readAsText(evt.target.files[0]);
    });
  }

  function invalidateLoad () {
    $tab.find('.load .selected').removeClass('selected');

    areas.load.$file.val('');
  }

  function loadFileError (evt) {
    // file api callback function
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      new Toast(Strings.filenotfound);
      break;
    case evt.target.error.NOT_READABLE_ERR:
      new Toast(Strings.filenotreadable);
      break;
    case evt.target.error.ABORT_ERR:
      break;
    default:
      new Toast(Strings.fileerror, Toast.LONG);
    }
  }

  function loadFileLoad (evt) {
    var blob, Alltabs;

    blob = evt.target.result;

    Storage.enable();
    Storage.clear(Options.dbname);

    try {
      if (State.fromBlob(blob)) {
        Storage.changed();
        resetStorageState();
        new Toast(Strings.loaded);
        Tabshandle.focus('teams');
      } else {
        // TODO what if something invalid has been returned?
      }
    } catch (err) {
      new Toast(Strings.loadfailed, Toast.LONG);
      // perform a complete reset of the everything related to the tournament
      Storage.enable();
      Storage.clear(Options.dbname);
      Alltabs = require('./alltabs');
      Alltabs.reset();
      State.reset();
      Alltabs.update();

      new Toast(Strings.newtournament);
      Tabshandle.focus('teams');
    }
  }

  function loadFileAbort () {
    new Toast(Strings.fileabort);
  }

  function reloadAutocomplete () {
    $.get(Options.playernameurl, undefined, function (jsontext, status, response) {
      if (jsontext.length === 0) {
        new Toast(Strings.fileempty);
      } else {
        try {
          Players.fromBlob(jsontext);
          Storage.store();
          new Toast(Strings.autocompleteloaded);
        } catch (e) {
          console.error(e);
          Players.reset();
          Storage.store();
          new Toast(Strings.autocompletereloadfailed, Toast.LONG);
        }
      }
    }, 'text').fail(function () {
      var content, i;

      console.error('could not read ' + Options.playernameurl + '. Is this a local installation?');

      new Toast(Strings.autocompletereloadfailed, Toast.LONG);
    });
  }

  function initAutocomplete () {
    areas.autocomplete = {};

    areas.autocomplete.$button = $tab.find('.autocomplete button');
    areas.autocomplete.$file = $tab.find('.autocomplete input.file');

    areas.autocomplete.$button.click(function () {
      var $button = $(this);

      // button contains image. Forward accidental clicks.
      if ($button.prop('tagName') !== 'BUTTON') {
        $button = $button.parents('button');
      }

      reloadAutocomplete();
    });

    areas.autocomplete.$file.change(function (evt) {
      var reader = new FileReader();
      reader.onerror = autocompleteFileError;
      reader.onabort = autocompleteFileAbort;
      reader.onload = autocompleteFileLoad;

      reader.readAsText(evt.target.files[0]);
    });

    // always load playernames when the program is opened
    window.setTimeout(reloadAutocomplete, 1000);
  }

  function invalidateAutocomplete () {
    areas.autocomplete.$file.val('');
  }

  function autocompleteFileError (evt) {
    // file api callback function
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      new Toast(Strings.filenotfound);
      break;
    case evt.target.error.NOT_READABLE_ERR:
      new Toast(Strings.filenotreadable);
      break;
    case evt.target.error.ABORT_ERR:
      break;
    default:
      new Toast(Strings.fileerror);
    }
  }

  function autocompleteFileLoad (evt) {
    var string;

    string = evt.target.result;

    Players.fromString(string);

    Storage.store();

    new Toast(Strings.autocompleteloaded);
  }

  function autocompleteFileAbort () {
    new Toast(Strings.fileabort);
  }

  function updateLocalStorageMeters () {
    var dbvalue, usage; // usage in MiB

    if (window.localStorage) {
      // player
      dbvalue = window.localStorage[Options.dbplayername];
      if (dbvalue) {
        usage = dbvalue.length / (1024 * 1024);
      } else {
        usage = 0.0;
      }

      areas.local.$playermeter.val(usage.toString());

      // tournament
      dbvalue = window.localStorage[Options.dbname];
      if (dbvalue) {
        usage = dbvalue.length / (1024 * 1024);
      } else {
        usage = 0.0;
      }

      areas.local.$tournamentmeter.val(usage.toString());
    }
  }

  function initLocalStorage () {
    areas.local = {};

    areas.local.$savebutton = $tab.find('.local button.save');
    areas.local.$clearbutton = $tab.find('.local button.clear');
    areas.local.$playermeter = $tab.find('.local .playerstoragemeter');
    areas.local.$tournamentmeter = $tab.find('.local .tournamentstoragemeter');

    areas.local.$savebutton.click(function (e) {
      Storage.enable();

      if (Storage.store()) {
        new Toast(Strings.saved);
      } else {
        new Toast(Strings.savefailed);
      }

      resetStorageState();

      e.preventDefault();
      return false;
    });

    areas.local.$clearbutton.click(function (e) {
      var Alltabs;

      // TODO don't use confirm()
      if (confirm(Strings.clearstorage)) {
        Storage.enable();
        Storage.clear(Options.dbname);

        Alltabs = require('./alltabs');

        Alltabs.reset();
        State.reset();
        Alltabs.update();

        new Toast(Strings.newtournament);
        Tabshandle.focus('teams');

        resetStorageState();
      }

      e.preventDefault();
      return false;
    });
  }

  /**
   * toggles the storage state depending on the current autosave checkbox state.
   * 
   * @returns {Boolean} true if autosave is enabled, false otherwise
   */
  function resetStorageState () {
    Storage.enable();
  }

  function init () {
    if ($tab) {
      console.error('tab_settings: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#settings');

    initCSV();
    initSave();
    initLoad();
    initAutocomplete();
    initLocalStorage();
  }

  /**
   * reset an initial state
   */
  Tab_Settings.reset = function () {
    if (!$tab) {
      init();
    }

    invalidateLoad();
    invalidateAutocomplete();

    resetStorageState();

    updateLocalStorageMeters();
  };

  Tab_Settings.update = function (force) {

    if (force) {
      updatepending = false;
    }

    if (updatepending) {
      console.log('updatepending');
    } else {
      updatepending = true;
      window.setTimeout(function () {
        try {
          Tab_Settings.reset();
          updateLocalStorageMeters();

          console.log('update');
        } catch (er) {
          console.log(er);
          new Toast(Strings.tabupdateerror.replace('%s', Strings.tab_settings));
        }
        updatepending = false;
      }, 1);
    }
  };

  Tab_Settings.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_Settings.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_Settings;
});
