import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import TournamentIndex from '../tournament/tournamentindex.js';
import Presets from 'presets';
function StartRoundController($button) {
  StartRoundController.superconstructor.call(this, new View(undefined, $button));
  this.view.$view.click(this.startRound.bind(this));
}
extend(StartRoundController, Controller);
StartRoundController.prototype.startRound = function () {
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
};
export default StartRoundController;