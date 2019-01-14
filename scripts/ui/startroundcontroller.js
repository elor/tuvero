define(['lib/extend', 'core/controller', 'core/view', 'ui/state', 'tournament/tournamentindex', 'presets'
], function (extend, Controller, View, State, TournamentIndex, Presets) {
  function StartRoundController ($button) {
    StartRoundController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.startRound.bind(this))
  }
  extend(StartRoundController, Controller)

  StartRoundController.prototype.startRound = function () {
    var tournament

    if (State.tournaments.length === 0) {
      tournament = TournamentIndex.createTournament('swiss', Presets.systems.swiss.ranking)
      tournament.getName().set('Vorrunde')
      State.teams.forEach(function (team, teamID) {
        tournament.addTeam(teamID)
      })
      State.tournaments.push(tournament)
    }

    State.tournaments.map(function (tournament) {
      var state = tournament.getState().get()
      if (state === 'idle' || state === 'initial') {
        tournament.run()
      }
    }, this)
  }

  return StartRoundController
})
