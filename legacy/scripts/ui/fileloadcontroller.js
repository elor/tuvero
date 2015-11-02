/**
 * FileLoadController
 *
 * @return FileLoadController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './storage', 'presets', './toast',
    './strings', './state'], function(extend, Controller, Storage, Presets,
    Toast, Strings, State) {
  /**
   * Constructor
   */
  function FileLoadController(view) {
    var controller;
    FileLoadController.superconstructor.call(this, view);

    controller = this;

    this.view.$view.change(function(evt) {
      var reader = new FileReader();
      reader.onerror = controller.error.bind(controller);
      reader.onabort = controller.abort.bind(controller);
      reader.onload = controller.load.bind(controller);

      reader.readAsText(evt.target.files[0]);
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

    blob = evt.target.result;

    Storage.enable();
    Storage.clear(Presets.names.dbname);

    Toast.closeTemporaryToasts();
    try {
      if (State.fromBlob(blob)) {
        Storage.changed();
        Toast.closeTemporaryToasts();
        new Toast(Strings.loaded, Toast.LONG);
      } else {
        // TODO what if something invalid has been returned?
      }
    } catch (err) {
      new Toast(Strings.loadfailed, Toast.LONG);
      // perform a complete reset of the everything related to the
      // tournament
      Storage.clear(Presets.names.dbname);
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
