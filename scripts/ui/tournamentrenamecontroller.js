import RenameController from './renamecontroller.js';

/**
 * Constructor
 */
class TournamentRenameController extends RenameController {
  constructor(view) {
    super(view, false);
  }

  setName(name) {
    if (name) {
      this.model.getName().set(name);
      return true;
    }
    return false;
  }

  getName() {
    return this.model.getName().get();
  }
}

export default TournamentRenameController;