define([ './toast', './strings', './team', './history', './ranking', './blob',
    './base64', './storage', './options' ], function (Toast, Strings, Team, History, Ranking, Blob, Base64, Storage, Options) {
  var Tab_Storage, $tab, areas;

  Tab_Storage = {};
  areas = {};

  function initCSV () {
    areas.csv = {};
    areas.csv.$download = $tab.find('.csv a');
    areas.csv.$text = $tab.find('.csv textarea');
    areas.csv.$buttons = $tab.find('.csv button');

    areas.csv.$text.click(function () {
      areas.csv.$text.select();
    });

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

    areas.csv.$text.val('');
    areas.csv.$text.hide();
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

    // update area
    areas.csv.$text.val(csv);
    areas.csv.$text.show();
  }

  function initSave () {
    areas.save = {};
    areas.save.$download = $tab.find('.save a');
    areas.save.$text = $tab.find('.save textarea');
    areas.save.$button = $tab.find('.save button');

    areas.save.$text.click(function () {
      areas.save.$text.select();
    });

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

    // update area
    areas.save.$text.val(save);
    areas.save.$text.show();
  }

  function invalidateSave () {
    areas.save.$download.attr('href', '#');
    areas.save.$download.hide();

    $tab.find('.save .selected').removeClass('selected');

    areas.save.$text.val('');
    areas.save.$text.hide();
  }

  function initLoad () {
    areas.load = {};

    areas.load.$text = $tab.find('.load textarea');
    areas.load.$button = $tab.find('.load button');
    areas.load.$file = $tab.find('.load input.file');

    areas.load.$text.click(function () {
      areas.load.$text.select();
    });

    areas.load.$button.click(function () {
      areas.load.$button.toggleClass('selected');

      if (areas.load.$button.hasClass('selected')) {
        areas.load.$text.show();
      } else {
        updateLoad();
      }
    });

    areas.load.$file.change(function (evt) {
      var reader = new FileReader();
      reader.onerror = loadFileError;
      reader.onabort = loadFileAbort;
      reader.onload = loadFileLoad;

      reader.readAsBinaryString(evt.target.files[0]);
    });
  }

  function updateLoad () {
    var load;

    load = areas.load.$text.val();

    Storage.enable();
    Storage.clear(Options.dbname);

    try {
      if (Blob.fromBlob(load)) {
        Storage.changed();
        Tab_Storage.toggleStorage();
        new Toast(Strings.loaded);
      }
    } catch (e) {
      new Toast(Strings.loadfailed);
      window.setTimeout(function () {
        // FIXME don't reload, but warn and reset from storage
        window.location.reload();
      }, 2000);
    }

    invalidateLoad();
  }

  function invalidateLoad () {
    areas.load.$text.val('');
    areas.load.$text.hide();
    
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
    case evt.target.error.ABORT_ER:
      break;
    default:
      new Toast(Strings.fileerror);
    }
  }

  function loadFileLoad (evt) {
    var blob;

    blob = evt.target.result;

    areas.load.$text.val(blob);

    Storage.enable();
    Storage.clear(Options.dbname);

    try {
      if (Blob.fromBlob(blob)) {
        Storage.changed();
        // TODO event handler
        Tab_Storage.toggleStorage();
        new Toast(Strings.loaded);
      }
    } catch (e) {
      new Toast(Strings.loadfailed);
      window.setTimeout(function () {
        // TODO don't reload, but reset from storage or something
        window.location.reload();
      }, 2000);
    }
  }

  function loadFileAbort () {
    new Toast(Strings.fileabort);
  }

  function initLocalStorage () {
    areas.local = {};

    areas.local.$autosave = $tab.find('.local input.autosave');
    areas.local.$savebutton = $tab.find('.local button.save');
    areas.local.$clearbox = $tab.find('.local input.clearbox');
    areas.local.$clearbutton = $tab.find('.local button.clear');

    areas.local.$savebutton.click(function () {
      Storage.enable();

      if (Storage.store()) {
        new Toast(Strings.saved);
      } else {
        new Toast(Strings.savefailed);
      }

      Tab_Storage.toggleStorage();
    });

    areas.local.$autosave.click(function () {
      if (Tab_Storage.toggleStorage()) {
        new Toast(Strings.autosaveon);
      } else {
        new Toast(Strings.autosaveoff);
      }
    });

    areas.local.$clearbox.click(function () {
      if (areas.local.$clearbox.prop('checked')) {
        areas.local.$clearbutton.prop('disabled', false);
      } else {
        areas.local.$clearbutton.prop('disabled', true);
      }
    });

    areas.local.$clearbutton.click(function () {
      // TODO use some jQuery magic
      if (confirm(Strings.clearstorage)) {
        Storage.enable();
        Storage.clear(Options.dbname);
        window.location.hash = '#';
        // TODO don't reload, just reset
        window.location.reload();
      }
    });
  }

  /**
   * toggles the storage state depending on the current autosave checkbox state.
   * 
   * FIXME get rid of this function, e.g. through an event handler
   * 
   * @returns {Boolean} true if autosave is enabled, false otherwise
   */
  Tab_Storage.toggleStorage = function () {
    if (areas.local.$autosave.prop('checked')) {
      Storage.enable();
      return true;
    }

    Storage.disable();
    return false;
  };

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
  };

  Tab_Storage.update = function () {
    Tab_Storage.reset();
  };

  return Tab_Storage;
});
