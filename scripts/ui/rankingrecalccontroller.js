import Controller from '../core/controller.js'
import View from '../core/view.js'
import State from './state.js'
import TournamentIndex from '../tournament/tournamentindex.js'
import Presets from 'presets'

class RankingRecalcController extends Controller {
  constructor ($button) {
    super(new View(undefined, $button))
    this.view.$view.click(this.recalculate.bind(this))
  }

  recalculate () {
    State.tournaments.map(function (tournament) {
      tournament.recalculateRanking()
      console.log('recalculating ranking for tournament ' + tournament.getID())
    }, this)
  }
}

export default RankingRecalcController
