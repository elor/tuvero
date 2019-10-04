define(['lib/extend', 'core/controller', 'core/view', 'ui/statesaver',
  'ui/toast'
], function (extend, Controller, View, StateSaver, Toast) {
  function SaveToStorageButtonController ($button) {
    SaveToStorageButtonController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.savenow.bind(this))
  }
  extend(SaveToStorageButtonController, Controller)

  SaveToStorageButtonController.prototype.savenow = function () {
    if (StateSaver.canSave()) {
      if (!StateSaver.saveState()) {
        console.error('autosave failed')
        return new Toast('Speichern fehlgeschlagen')
      }

      return new Toast('Turnierstand gespeichert')
    }
  }

  return SaveToStorageButtonController
})
