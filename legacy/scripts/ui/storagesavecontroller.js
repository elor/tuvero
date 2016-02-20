/**
 * StorageSaveController
 *
 * @return StorageSaveController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/statesaver', './toast',
    './strings'], function(extend, Controller, StateSaver, Toast, Strings) {
  /**
   * Constructor
   */
  function StorageSaveController(view) {
    StorageSaveController.superconstructor.call(this, view);

    this.view.$view.click(this.save.bind(this));
  }
  extend(StorageSaveController, Controller);

  StorageSaveController.prototype.save = function() {
    if (StateSaver.saveState()) {
      new Toast(Strings.saved);
    }
  };

  return StorageSaveController;
});
