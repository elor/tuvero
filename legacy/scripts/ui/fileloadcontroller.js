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
  function FileLoadController(view) {
    var controller;
    FileLoadController.superconstructor.call(this, view);

    this.reader = undefined;
    this.file = undefined;
    this.filename = undefined;

    controller = this;

    this.view.$view.change(function(evt) {
      controller.reader = new FileReader();
      controller.file = evt.target.files[0];

      controller.reader.onerror = controller.error.bind(controller);
      controller.reader.onabort = controller.abort.bind(controller);
      controller.reader.onload = controller.load.bind(controller);

      controller.reader.readAsText(controller.file);
    });
  }
  extend(FileLoadController, Controller);

  FileLoadController.prototype.error = function(evt) {
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
      StateSaver.newTree(this.file.name);
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
