define([ './toast', './strings', './team', './history', './tab_ranking',
    './blob', './base64', './storage' ], function (Toast, Strings, Team, History, Tab_Ranking, Blob, Base64, Storage) {
  var Tab_Storage, $csvanchor, $csvarea, $saveanchor, $savearea, $loadarea, $loadfile;

  Tab_Storage = {};

  $(function ($) {
    $csvanchor = $('#storage .csv a');
    $csvarea = $('#storage .csv textarea');

    $csvarea.click(function () {
      $csvarea.select();
    });

    invalidateCSV();
  });

  function invalidateCSV () {
    $('#storage .csv .selected').removeClass('selected');

    $csvanchor.attr('href', '#');
    $csvanchor.hide();

    $csvarea.val('');
    $csvarea.hide();
  }

  function csvupdate () {
    var $buttons, csv;

    $buttons = $('#storage .csv button');

    csv = [];

    if ($($buttons[0]).hasClass('selected')) {
      csv.push(Team.toCSV());
    }
    if ($($buttons[1]).hasClass('selected')) {
      csv.push(Tab_Ranking.toCSV());
    }
    if ($($buttons[2]).hasClass('selected')) {
      csv.push(History.toCSV());
    }

    if (csv.length === 0) {
      invalidateCSV();
      return;
    }

    csv = csv.join('\r\n""\r\n');

    // update link
    $csvanchor.attr('href', 'data:application/csv;base64,' + btoa(csv));
    $csvanchor.show();

    // update area
    $csvarea.val(csv);
    $csvarea.show();
  }

  $('#storage .csv button').click(function (e) {
    var $button = $(e.target);

    if ($button.prop('tagName') === 'IMG') {
      $button = $button.parent();
    }

    $button.toggleClass('selected');

    csvupdate();
  });

  $(function ($) {
    var saveupdate, $savebutton;

    $saveanchor = $('#storage .save a');
    $savearea = $('#storage .save textarea');
    $savebutton = $('#storage .save button');

    $savearea.click(function () {
      $savearea.select();
    });

    saveupdate = function () {
      var save, $buttons;

      $buttons = $('#storage .save button');

      save = Blob.toBlob();

      // update link
      $saveanchor.attr('href', 'data:application/json;base64,' + btoa(save));
      $saveanchor.show();

      // update area
      $savearea.val(save);
      $savearea.show();
    };

    $savebutton.click(function () {
      $savebutton.toggleClass('selected');
      if ($savebutton.hasClass('selected')) {
        saveupdate();
      } else {
        invalidateSave();
      }
    });

    invalidateSave();
  });

  function invalidateSave () {
    $saveanchor.attr('href', '#');
    $saveanchor.hide();

    $savearea.val('');
    $savearea.hide();
  }

  $(function ($) {
    var loadupdate, $loadbutton;

    $loadarea = $('#storage .load textarea');
    $loadbutton = $('#storage .load button');
    $loadfile = $('#storage .load input.file');

    $loadarea.click(function () {
      $loadarea.select();
    });

    loadupdate = function () {
      var load, $buttons;

      $buttons = $('#storage .load button');

      load = $loadarea.val();

      Storage.enable();
      Storage.clear();

      try {
        if (Blob.fromBlob(load)) {
          Storage.changed();
          Tab_Storage.toggleStorage();
          new Toast(Strings.loaded);
        }
      } catch (e) {
        new Toast(Strings.loadfailed);
        window.setTimeout(function () {
          window.location.reload();
        }, 2000);
      }

      invalidateLoad();
    };

    $loadbutton.click(function () {
      $loadbutton.toggleClass('selected');
      if ($loadbutton.hasClass('selected')) {
        $loadarea.show();
      } else {
        loadupdate();
      }
    });

    function fileerror (evt) {
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

    function fileload (evt) {
      var blob;

      blob = evt.target.result;

      $loadarea.val(blob);

      Storage.enable();
      Storage.clear();

      try {
        if (Blob.fromBlob(blob)) {
          Storage.changed();
          Tab_Storage.toggleStorage();
          new Toast(Strings.loaded);
        }
      } catch (e) {
        new Toast(Strings.loadfailed);
        window.setTimeout(function () {
          // window.location.reload();
        }, 2000);
      }
    }

    function fileabort () {
      new Toast(Strings.fileabort);
    }

    $loadfile.change(function (evt) {
      var reader = new FileReader();
      reader.onerror = fileerror;
      reader.onabort = fileabort;
      reader.onload = fileload;

      reader.readAsBinaryString(evt.target.files[0]);
    });

    invalidateLoad();
  });

  function invalidateLoad () {
    $loadarea.val('');
    $loadarea.hide();
    $loadfile.val('');
  }

  $(function ($) {
    var $box, $save, $clear, $clearbox;

    $box = $('#storage .local input.autosave');
    $save = $('#storage .local button.save');
    $clearbox = $('#storage .local input.clearbox');
    $clear = $('#storage .local button.clear');

    $clear.click(function () {
      if (confirm(Strings.clearstorage)) {
        Storage.enable();
        Storage.clear();
        window.location.hash = '#teams';
        window.location.reload();
      }
    });

    $save.click(function () {
      Storage.enable();

      if (Storage.store()) {
        new Toast(Strings.saved);
      } else {
        new Toast(Strings.savefailed);
      }

      Tab_Storage.toggleStorage();
    });

    /**
     * toggles the storage state depending on the current autosave checkbox
     * state.
     * 
     * @returns {Boolean} true if autosave is enabled, false otherwise
     */
    Tab_Storage.toggleStorage = function () {
      if ($box.prop('checked')) {
        Storage.enable();
        return true;
      }

      Storage.disable();
      return false;
    };

    $box.click(function () {
      if (Tab_Storage.toggleStorage()) {
        new Toast(Strings.autosaveon);
      } else {
        new Toast(Strings.autosaveoff);
      }
    });

    $clearbox.click(function () {
      if ($clearbox.prop('checked')) {
        $clear.prop('disabled', false);
      } else {
        $clear.prop('disabled', true);
      }
    });

    Tab_Storage.invalidate = function () {
      invalidateCSV();
      invalidateSave();
      invalidateLoad();
    };
  });

  return Tab_Storage;
});
