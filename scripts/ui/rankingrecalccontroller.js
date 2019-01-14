define(['lib/extend', 'core/controller', 'core/view', 'ui/state', 'tournament/tournamentindex', 'presets'
], function (extend, Controller, View, State, TournamentIndex, Presets) {
  function RankingRecalcController ($button) {
    RankingRecalcController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.recalculate.bind(this))
  }
  extend(RankingRecalcController, Controller)

  RankingRecalcController.prototype.recalculate = function () {
    State.tournaments.map(function (tournament) {
      tournament.recalculateRanking()
      console.log('recalculating ranking for tournament ' + tournament.getID())
    }, this)
  }

  return RankingRecalcController
})
