import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import TournamentIndex from '../tournament/tournamentindex.js';
import Presets from 'presets';
function RankingRecalcController($button) {
  RankingRecalcController.superconstructor.call(this, new View(undefined, $button));
  this.view.$view.click(this.recalculate.bind(this));
}
extend(RankingRecalcController, Controller);
RankingRecalcController.prototype.recalculate = function () {
  State.tournaments.map(function (tournament) {
    tournament.recalculateRanking();
    console.log('recalculating ranking for tournament ' + tournament.getID());
  }, this);
};
export default RankingRecalcController;