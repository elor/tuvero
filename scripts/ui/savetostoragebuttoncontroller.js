import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import StateSaver from './statesaver.js';
import Toast from './toast.js';
function SaveToStorageButtonController($button) {
  SaveToStorageButtonController.superconstructor.call(this, new View(undefined, $button));
  this.view.$view.click(this.savenow.bind(this));
}
extend(SaveToStorageButtonController, Controller);
SaveToStorageButtonController.prototype.savenow = function () {
  if (StateSaver.canSave()) {
    if (!StateSaver.saveState()) {
      console.error('autosave failed');
      return new Toast('Speichern fehlgeschlagen');
    }
    return new Toast('Turnierstand gespeichert');
  }
};
export default SaveToStorageButtonController;