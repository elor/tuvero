define([ './toast', './strings', './team', './history', './ranking', './state',
    '../lib/base64', './storage', './options', './opts', './players',
    './tabshandle' ], function (Toast, Strings, Team, History, Ranking, State, Base64, Storage, Options, Opts, Players, Tabshandle) {
  var Tab_Settings, $tab, areas, options, updatepending;

  updatepending = false;

  Tab_Settings = {};
  options = {};
  areas = {};

  function initCSV () {
    areas.csv = {};
    areas.csv.$download = $tab.find('.csv a');
    areas.csv.$buttons = $tab.find('.csv button');

    // set csv selection buttons
    areas.csv.$buttons.click(function () {
      var $button = $(this);

      // button contains image. Forward accidental clicks.
      if ($button.prop('tagName') === 'IMG') {
        $button = $button.parent();
      }

      $button.toggleClass('selected');

      csvupdate();
    });
  }

  function invalidateCSV () {
    $tab.find('.csv .selected').removeClass('selected');

    areas.csv.$download.attr('href', '#');
    areas.csv.$download.hide();
  }

  function createDownloadURL (content, mimetype) {
    var url;
    mimetype = mimetype || 'text/plain';

    if (window.URL && window.URL.createObjectURL && Blob) {
      url = window.URL.createObjectURL(new Blob([ content ]));
    } else {
      url = 'data:' + mimetype + ';base64,' + btoa(content);
    }

    return url;
  }

  function csvupdate () {
    var $buttons, csv, url;

    $buttons = areas.csv.$buttons;

    csv = [];

    if ($buttons.eq(0).hasClass('selected')) {
      csv.push(Team.toCSV());
    }
    if ($buttons.eq(1).hasClass('selected')) {
      csv.push(Ranking.toCSV());
    }
    if ($buttons.eq(2).hasClass('selected')) {
      csv.push(History.toCSV());
    }

    if (csv.length === 0) {
      invalidateCSV();
      return;
    }

    csv = csv.join('\r\n""\r\n');

    url = createDownloadURL(csv, 'application/csv');

    areas.csv.$download.attr('href', url);
    areas.csv.$download.show();
  }

  function initSave () {
    areas.save = {};
    areas.save.$download = $tab.find('.save a');
    areas.save.$button = $tab.find('.save button');

    areas.save.$button.click(function () {
      areas.save.$button.toggleClass('selected');

      if (areas.save.$button.hasClass('selected')) {
        updateSave();
      } else {
        invalidateSave();
      }
    });

  }

  function updateSave () {
    var save;

    // TODO read from/compare with database

    save = State.toBlob();

    url = createDownloadURL(save, 'application/json');
    // update link
    areas.save.$download.attr('href', url);
    areas.save.$download.show();
  }

  function invalidateSave () {
    areas.save.$download.attr('href', '#');
    areas.save.$download.hide();

    $tab.find('.save .selected').removeClass('selected');
  }

  function initLoad () {
    areas.load = {};

    areas.load.$file = $tab.find('.load input.file');

    areas.load.$file.change(function (evt) {
      var reader = new FileReader();
      reader.onerror = loadFileError;
      reader.onabort = loadFileAbort;
      reader.onload = loadFileLoad;

      reader.readAsBinaryString(evt.target.files[0]);
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
        // TODO event handler
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
        // TODO check format?
        Players.fromBlob(jsontext);
        Storage.store();
        new Toast(Strings.autocompleteloaded);
      }
    }, 'text').fail(function () {
      var content, i;
      // TODO use an iframe, message passing and and a separate player database

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

      reader.readAsBinaryString(evt.target.files[0]);
    });
  }

  function updateAutocomplete () {
    if (Players.get().length <= 1) {
      // try to reload the player names from web
      reloadAutocomplete();
    }
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

      // TODO use some jQuery magic
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

    invalidateCSV();
    invalidateSave();
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
        Tab_Settings.reset();
        updateAutocomplete();
        updateLocalStorageMeters();
        updatepending = false;
        console.log('update');
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
