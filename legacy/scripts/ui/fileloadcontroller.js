/**
 * FileLoadController
 *
 * @return FileLoadController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'presets', './toast', './strings',
    'ui/stateloader', 'ui/statesaver'], function(extend, Controller, Presets,
    Toast, Strings, StateLoader, StateSaver) {
  /**
   * Constructor
   */
  function FileLoadController(view, $button) {
    var controller;
    FileLoadController.superconstructor.call(this, view);

    this.reader = undefined;
    this.file = undefined;

    controller = this;

    this.view.$view.change(function(evt) {
      controller.initFileRead(evt.target.files[0]);
    });

    if ($button) {
      $button.on('dragover', this.buttonDragOver.bind(this));
      $button.on('drop', this.buttonDrop.bind(this));
      $button.click(function() {
        controller.view.$view.click();
      });
    }
  }
  extend(FileLoadController, Controller);

  FileLoadController.prototype.buttonDragOver = function(evt) {
    evt.originalEvent.dataTransfer.dropEffect = 'copy';
    evt.preventDefault();
    return false;
  };

  FileLoadController.prototype.buttonDrop = function(evt) {
    var files = evt.originalEvent.dataTransfer.files;

    if (files.length == 1 && files[0]) {
      this.initFileRead(files[0]);
    } else {
      // TODO use Strings
      new Toast('wrong number of files', Toast.LONG);
    }

    evt.preventDefault();
    return false;
  };

  FileLoadController.prototype.initFileRead = function(file) {
    this.file = file;
    this.reader = new FileReader();

    this.reader.onerror = this.error.bind(this);
    this.reader.onabort = this.abort.bind(this);
    this.reader.onload = this.load.bind(this);

    this.reader.readAsText(this.file);
  };

  FileLoadController.prototype.error = function(evt) {
    // file api callback function
    StateLoader.unload();
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
  };

  FileLoadController.prototype.load = function(evt) {
    var blob, Alltabs;

    if (evt.target !== this.reader) {
      new Toast(Strings.loadfailed, Toast.LONG);
      this.reset();
    }

    blob = evt.target.result;

    Toast.closeTemporaryToasts();
    try {
      // TODO use filename until the tournament name is stored in the file, too
      StateSaver.newTree(this.file.name.replace(/(\.(json|txt|csv))+$/, ''));
      if (StateLoader.loadString(blob)) {
        StateSaver.saveState();

        Toast.closeTemporaryToasts();
        new Toast(Strings.loaded, Toast.LONG);
      } else {
        new Toast(Strings.loadfailed, Toast.LONG);
        // TODO what if something invalid has been returned?
      }
    } catch (err) {
      new Toast(Strings.loadfailed, Toast.LONG);
      // perform a complete reset of the everything related to the
      // tournament
    }
    this.reset();
  };

  FileLoadController.prototype.abort = function() {
    new Toast(Strings.fileabort);
  };

  FileLoadController.prototype.reset = function() {
    this.view.$view.val('');
  };

  return FileLoadController;
});
