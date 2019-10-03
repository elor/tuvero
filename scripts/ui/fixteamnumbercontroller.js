define(['lib/extend', 'core/controller', 'core/view', 'ui/state'
], function (extend, Controller, View, State) {
  function FixTeamNumberController ($button) {
    FixTeamNumberController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.fixteamnumbers.bind(this))
  }
  extend(FixTeamNumberController, Controller)

  FixTeamNumberController.prototype.fixteamnumbers = function () {
    State.teams.forEach(function (team) {
      if (team.number === undefined || team.number === '') {
        team.number = '' + (team.id + 1)
        console.log(team)
      }
    })
  }

  return FixTeamNumberController
})
