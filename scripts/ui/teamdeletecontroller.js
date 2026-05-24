import Controller from '../core/controller.js';
import State from './state.js';
import Strings from './strings.js';

/**
   * Constructor
   */
class TeamDeleteController extends Controller {
  constructor(view) {
    super(view);
    this.view.$view.find('button.delete').click(this.confirmDeletion.bind(this));
  }

  /**
     * ask the user if he really wants to delete all teams. abort if not.
     */
  confirmDeletion() {
    const id = this.model.getID();
    if (id === -1) {
      console.error('Cannot delete team: It has not been assigned to a list, hence its ID is -1');
    } else if (State.teams.get(id) !== this.model) {
      console.error('Cannot delete team: ID mismatch. Has the team already been removed from the list?');
    } else if (window.confirm(Strings.deleteteamconfirmation.replace('%1', this.model.getID() + 1).replace('%2', this.model.getNames().join('/')))) {
      this.performDeletion();
    }
  }

  /**
     * really REALLY delete all registered teams
     */
  performDeletion() {
    const id = this.model.getID();
    if (id === -1) {
      console.error('Cannot delete team: It has not been assigned to a list, hence its ID is -1');
    } else if (State.teams.get(id) !== this.model) {
      console.error('Cannot delete team: ID mismatch. Has the team already been removed from the list?');
    } else {
      State.teams.remove(id);
    }
  }
}

export default TeamDeleteController;