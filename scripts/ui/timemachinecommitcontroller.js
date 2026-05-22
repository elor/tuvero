/**
 * TimeMachineCommitController
 *
 * @return TimeMachineCommitController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RenameController from './renamecontroller.js';
import TimeMachine from '../timemachine/timemachine.js';
import StateLoader from './stateloader.js';
import Strings from './strings.js';
import Toast from './toast.js';
import FileSaverModel from './filesavermodel.js';
/**
 * Constructor
 */
function TimeMachineCommitController(view) {
  TimeMachineCommitController.superconstructor.call(this, view, false);
  this.view.$view.find('button.removecommit').click(this.remove.bind(this));
  this.view.$view.find('button.loaddescendant').click(this.load.bind(this));
  this.view.$view.find('button.cleanuptree').click(this.cleanup.bind(this));
  this.view.$view.find('button.download').click(this.download.bind(this));
}
extend(TimeMachineCommitController, RenameController);
TimeMachineCommitController.prototype.remove = function () {
  let active, confirmtext, name;
  active = TimeMachine.isRelatedToActive(this.model);
  name = this.model.getTreeName() || 'noname';
  confirmtext = active ? Strings.confirmactivetreeremoval : Strings.confirmtreeremoval;
  if (window.confirm(confirmtext.replace('%s', name))) {
    this.model.remove();
    if (active) {
      StateLoader.unload();
    }
  }
};
TimeMachineCommitController.prototype.cleanup = function () {
  TimeMachine.cleanup(this.model, 0);
};
TimeMachineCommitController.prototype.load = function () {
  StateLoader.loadCommit(this.model.getYoungestDescendant() || this.model);
};
TimeMachineCommitController.prototype.download = function () {
  let fileSaver;
  fileSaver = new FileSaverModel(this.model.getYoungestDescendant() || this.model);
  if (!fileSaver.save()) {
    Toast.once(Strings.savefailed);
  }
};
TimeMachineCommitController.prototype.getName = function (name) {
  return this.model.getTreeName();
};
TimeMachineCommitController.prototype.setName = function (name) {
  if (name) {
    this.model.setTreeName(name);
    return true;
  }
  return false;
};
export default TimeMachineCommitController;