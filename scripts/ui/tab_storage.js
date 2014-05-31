define([ './toast', './strings', './team', './history', './ranking', './blob',
    './base64', './storage', './options', './opts', './players', './tabshandle' ], function (Toast, Strings, Team, History, Ranking, Blob, Base64, Storage, Options, Opts, Players, Tabshandle) {
  var Tab_Storage, $tab, areas, options;

  Tab_Storage = {};
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

  function csvupdate () {
    var $buttons, csv;

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

    // update download link
    areas.csv.$download.attr('href', 'data:application/csv;base64,' + btoa(csv));
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

    save = Blob.toBlob();

    // update link
    areas.save.$download.attr('href', 'data:application/json;base64,' + btoa(save));
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
      new Toast(Strings.fileerror);
    }
  }

  function loadFileLoad (evt) {
    var blob;

    blob = evt.target.result;

    Storage.enable();
    Storage.clear(Options.dbname);

    try {
      if (Blob.fromBlob(blob)) {
        Storage.changed();
        // TODO event handler
        resetStorageState();
        new Toast(Strings.loaded);
        Tabshandle.focus('teams');
      } else {
        // TODO what if something invalid has been returned?
      }
    } catch (e) {
      new Toast(Strings.loadfailed);
      window.setTimeout(function () {
        // TODO don't reload, but reset from storage or something
        window.location.reload(); // reload after load fail
      }, 2000);
    }
  }

  function loadFileAbort () {
    new Toast(Strings.fileabort);
  }

  function reloadAutocomplete () {
    $.ajax({
      dataType : 'text',
      contentType : "text/plain; charset=utf-8",
      url : Options.playernameurl,
      timeout : 3000
    }).done(function (response, status) {
      if (response.length === 0) {
        new Toast(Strings.fileempty);
      } else {
        // TODO check format?
        Players.fromString(response);
        Storage.store();
        new Toast(Strings.autocompleteloaded);
      }
    }).fail(function () {
      var content, i;
      // TODO use an iframe, message passing and and a separate player database

      console.error('could not read ' + Options.playernameurl + '. Is this a local installation?');

      new Toast(Strings.autocompletereloadfailed, 5);
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

  function initLocalStorage () {
    areas.local = {};

    areas.local.$savebutton = $tab.find('.local button.save');
    areas.local.$clearbutton = $tab.find('.local button.clear');

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
        Blob.reset();
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
      console.error('tab_storage: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#storage');

    initCSV();
    initSave();
    initLoad();
    initAutocomplete();
    initLocalStorage();
  }

  /**
   * reset an initial state
   */
  Tab_Storage.reset = function () {
    if (!$tab) {
      init();
    }

    invalidateCSV();
    invalidateSave();
    invalidateLoad();
    invalidateAutocomplete();

    resetStorageState();
  };

  Tab_Storage.update = function () {
    Tab_Storage.reset();
    updateAutocomplete();
  };

  Tab_Storage.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_Storage.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_Storage;
});
