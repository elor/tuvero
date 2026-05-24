import Listener from '../core/listener.js';
import State from './state.js';
import ListCollectorModel from './listcollectormodel.js';
import TeamModel from './teammodel.js';
import Toast from './toast.js';
import Strings from './strings.js';

class TeamToastsListener extends Listener {
  constructor(emitter) {
    super(emitter);
  }

  onupdate(teamlist, event, data) {
    let newname, team, player;
    team = data.source;
    if (team) {
      player = team.getPlayer(data.id);
      if (player) {
        newname = player.getName();
        return new Toast(Strings.namechanged.replace('%s', newname));
      }
    }
  }

  oninsert(teamlist, event, data) {
    let teamno;
    teamno = data.id;
    return new Toast(Strings.teamadded.replace('%s', teamno + 1));
  }

  onremove(teamlist, event, data) {
    let teamno;
    teamno = data.id;
    return new Toast(Strings.teamdeleted.replace('%s', teamno + 1));
  }

  static init() {
    // FIXME move this to the storage file, or associate it somehow otherwise
    TeamToastsListener.listeners.teams = new TeamToastsListener(State.teams);
    TeamToastsListener.listeners.namechange = new TeamToastsListener(new ListCollectorModel(State.teams, TeamModel));
  }

  static listeners = {};
}

export default TeamToastsListener;