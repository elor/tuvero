/**
 * TeamController: Let the user change player names, when she clicks a player
 * name
 *
 * @return TeamController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RenameController from './renamecontroller.js';
import Toast from './toast.js';
import Strings from './strings.js';
import State from './state.js';
import TabsHandle from './tabshandle.js';
function TeamController(view, $input) {
  TeamController.superconstructor.call(this, view);
  this.view.$view.find('.teamno').click(this.openModal.bind(this));
}
extend(TeamController, RenameController);
TeamController.prototype.getPlayer = function ($name) {
  var index, $names;
  $names = this.view.$view.find('.name');
  if ($names.length === 0) {
    $names = this.view.$view.filter('.name');
  }
  index = $names.index($name);
  return this.model.getPlayer(index);
};
TeamController.prototype.getNameModel = function ($anchor) {
  if (this.$anchor.hasClass('teamname')) {
    return this.model;
  } else {
    return this.getPlayer(this.$anchor);
  }
};
TeamController.prototype.getName = function () {
  var nameModel;
  if (!this.$anchor) {
    return '';
  }
  nameModel = this.getNameModel(this.$anchor);
  return nameModel.getName();
};
TeamController.prototype.setName = function (name) {
  var nameModel;
  if (!this.$anchor) {
    return false;
  }
  nameModel = this.getNameModel(this.$anchor);
  nameModel.setName(name);
  return true;
};
TeamController.prototype.openModal = function () {
  State.focusedteam.set(this.model);
  TabsHandle.focus('team');
};
TeamController.prototype.destroy = function () {
  if (State.focusedteam.get() === this.model) {
    State.focusedteam.set(undefined);
  }
  TeamController.superclass.destroy.call(this);
};
export default TeamController;