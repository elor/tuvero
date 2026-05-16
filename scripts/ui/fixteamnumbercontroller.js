import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import Toast from './toast.js';
function FixTeamNumberController($button) {
  FixTeamNumberController.superconstructor.call(this, new View(undefined, $button));
  this.view.$view.click(this.fixteamnumbers.bind(this));
}
extend(FixTeamNumberController, Controller);
FixTeamNumberController.prototype.fixteamnumbers = function () {
  State.teams.forEach(function (team) {
    if (team.number === undefined || team.number === '') {
      team.number = '' + (team.id + 1);
    }
  });
  return new Toast('Teamnummern zugewiesen');
};
export default FixTeamNumberController;