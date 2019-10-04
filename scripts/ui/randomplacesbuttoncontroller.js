define(['lib/extend', 'core/controller', 'core/view', 'ui/state',
  'ui/toast', 'tuvero'
], function (extend, Controller, View, State, Toast, tuvero) {
  function RandomPlacesButtonController ($button) {
    RandomPlacesButtonController.superconstructor.call(this, new View(undefined, $button))

    this.view.$view.click(this.randomizeplaces.bind(this))
  }
  extend(RandomPlacesButtonController, Controller)

  RandomPlacesButtonController.prototype.randomizeplaces = function () {
    var allmatches, places

    allmatches = []
    State.tournaments.forEach(function (tournament) {
      tournament.matches.forEach(function (match) {
        allmatches.push(match)
      })
    })

    places = tuvero.random.range(1, allmatches.length + 1)

    allmatches.forEach(function (match, index) {
      match.setPlace(places[index].toString())
    })

    return new Toast(allmatches.length + ' Bahnen/Plätze zugelost')
  }

  return RandomPlacesButtonController
})
