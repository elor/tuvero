import Controller from '../core/controller.js';
import View from '../core/view.js';
import StateSaver from './statesaver.js';
import Toast from './toast.js';

class SaveToStorageButtonController extends Controller {
  constructor($button) {
    super(new View(undefined, $button));
    this.view.$view.click(this.savenow.bind(this));
  }

  savenow() {
    if (StateSaver.canSave()) {
      if (!StateSaver.saveState()) {
        console.error('autosave failed');
        return new Toast('Speichern fehlgeschlagen');
      }
      return new Toast('Turnierstand gespeichert');
    }
  }
}

export default SaveToStorageButtonController;