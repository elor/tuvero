/**
 * TournamentRenameController
 *
 * @return TournamentRenameController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RenameController from './renamecontroller.js';
/**
 * Constructor
 */
function TournamentRenameController(view) {
  TournamentRenameController.superconstructor.call(this, view, false);
}
extend(TournamentRenameController, RenameController);
TournamentRenameController.prototype.setName = function (name) {
  if (name) {
    this.model.getName().set(name);
    return true;
  }
  return false;
};
TournamentRenameController.prototype.getName = function () {
  return this.model.getName().get();
};
export default TournamentRenameController;