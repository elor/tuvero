import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import TournamentIndex from '../tournament/tournamentindex.js';
import Presets from 'presets';

class StartRoundController extends Controller {
  constructor($button) {
    super(new View(undefined, $button));
    this.view.$view.click(this.startRound.bind(this));
  }

  startRound() {
    let tournament;
    if (State.tournaments.length === 0) {
      tournament = TournamentIndex.createTournament('swiss', Presets.systems.swiss.ranking);
      tournament.getName().set('Vorrunde');
      State.teams.forEach(function (team, teamID) {
        tournament.addTeam(teamID);
      });
      State.tournaments.push(tournament);
    }
    State.tournaments.map(function (tournament) {
      const state = tournament.getState().get();
      if (state === 'idle' || state === 'initial') {
        tournament.run();
      }
    }, this);
  }
}

export default StartRoundController;