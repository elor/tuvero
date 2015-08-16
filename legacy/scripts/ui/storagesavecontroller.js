/**
 * StorageSaveController
 *
 * @return StorageSaveController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './storage', './toast', './strings'], //
function(extend, Controller, Storage, Toast, Strings) {
  /**
   * Constructor
   */
  function StorageSaveController(view) {
    StorageSaveController.superconstructor.call(this, view);

    this.view.$view.click(function() {
      if (Storage.store()) {
        new Toast(Strings.saved);
      }
    });
  }
  extend(StorageSaveController, Controller);

  return StorageSaveController;
});
