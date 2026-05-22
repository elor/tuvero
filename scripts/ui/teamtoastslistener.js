/**
 * Emit toasts when a team action is performed in the teams tab, i.e. adding,
 * removing or renaming.
 *
 * @return TeamToastsListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Listener from '../core/listener.js';
import State from './state.js';
import ListCollectorModel from './listcollectormodel.js';
import TeamModel from './teammodel.js';
import Toast from './toast.js';
import Strings from './strings.js';
function TeamToastsListener(emitter) {
  TeamToastsListener.superconstructor.call(this, emitter);
}
extend(TeamToastsListener, Listener);
TeamToastsListener.prototype.onupdate = function (teamlist, event, data) {
  let newname, team, player;
  team = data.source;
  if (team) {
    player = team.getPlayer(data.id);
    if (player) {
      newname = player.getName();
      return new Toast(Strings.namechanged.replace('%s', newname));
    }
  }
};
TeamToastsListener.prototype.oninsert = function (teamlist, event, data) {
  let teamno;
  teamno = data.id;
  return new Toast(Strings.teamadded.replace('%s', teamno + 1));
};
TeamToastsListener.prototype.onremove = function (teamlist, event, data) {
  let teamno;
  teamno = data.id;
  return new Toast(Strings.teamdeleted.replace('%s', teamno + 1));
};
TeamToastsListener.listeners = {};
TeamToastsListener.init = function () {
  // FIXME move this to the storage file, or associate it somehow otherwise
  TeamToastsListener.listeners.teams = new TeamToastsListener(State.teams);
  TeamToastsListener.listeners.namechange = new TeamToastsListener(new ListCollectorModel(State.teams, TeamModel));
};
export default TeamToastsListener;