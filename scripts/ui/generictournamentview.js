import View from '../core/view.js'
import TournamentView from './tournamentview.js'
import RoundTournamentView from './roundtournamentview.js'
import SwissTournamentView from './swisstournamentview.js'
import KOTournamentView from './kotournamentview.js'
import PlacementTournamentView from './placementtournamentview.js'
import PoulesTournamentView from './poulestournamentview.js'
const constructors = {
  swiss: SwissTournamentView,
  formulex: SwissTournamentView,
  round: RoundTournamentView,
  ko: KOTournamentView,
  placement: PlacementTournamentView,
  poules: PoulesTournamentView
}
const defaultConstructor = TournamentView

/**
   * Constructor
   */
class GenericTournamentView extends View {
  constructor (tournament, $view, tournaments) {
    let Constructor
    super(undefined, $view)
    this.tournament = tournament
    if (tournament) {
      Constructor = constructors[tournament.SYSTEM] || defaultConstructor
      this.view = new Constructor(tournament, $view, tournaments)
    } else {
      this.view = new View(undefined, $view)
    }
  }

  destroy () {
    this.view.destroy()
    super.destroy()
  }
}

export default GenericTournamentView
