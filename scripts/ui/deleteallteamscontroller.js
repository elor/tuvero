import Controller from '../core/controller.js';
import State from './state.js';
import Strings from './strings.js';

class DeleteAllTeamsController extends Controller {
  constructor(view) {
    super(view);
    this.view.$view.click(this.confirmDeletion.bind(this));
  }

  confirmDeletion() {
    if (this.model.get()) {
      console.error('cannot delete all teams: registration is already closed');
      return;
    }
    if (window.confirm(Strings.deleteallteamsconfirmation)) {
      this.performDeletion();
    }
  }

  performDeletion() {
    State.teams.clear();
  }
}

export default DeleteAllTeamsController;