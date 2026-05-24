import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import TeamModel from './teammodel.js';
import PlayerModel from './playermodel.js';
import Random from '../core/random.js';
import StateSaver from './statesaver.js';

/**
 * Constructor
 */
class RegisterIDsController extends Controller {
  constructor($button, $numteams) {
    super(new View(undefined, $button));
    this.$button = $button;
    this.$numteams = $numteams;
    $button.click(this.registerTeams.bind(this));
  }

  registerTeams() {
    let numTeams, id;
    numTeams = Number(this.$numteams.val());
    if (isNaN(numTeams)) {
      return;
    }
    if (!StateSaver.canSave()) {
      StateSaver.createNewEmptyTree('Tuvero Test-Turnier');
    }
    for (id = 0; id < numTeams; id += 1) {
      State.teams.push(RegisterIDsController.createTeam(id + 1));
    }
  }

  static createTeam(id) {
    let players, team;
    players = [];
    while (players.length < State.teamsize.get()) {
      players.push(new PlayerModel('' + id));
    }
    team = new TeamModel(players);
    return team;
  }
}

export default RegisterIDsController;