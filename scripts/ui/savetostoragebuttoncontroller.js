define(['lib/extend', 'core/controller', 'core/view', 'ui/statesaver'
], function (extend, Controller, View, StateSaver) {
  function SaveToStorageButtonController ($button) {
    SaveToStorageButtonController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.savenow.bind(this))
  }
  extend(SaveToStorageButtonController, Controller)

  SaveToStorageButtonController.prototype.savenow = function () {
    if (StateSaver.canSave()) {
      if (!StateSaver.saveState()) {
        console.error('autosave failed')
      }
    }
  }

  return SaveToStorageButtonController
})
