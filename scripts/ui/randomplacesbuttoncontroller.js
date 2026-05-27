import Controller from '../core/controller.js'
import View from '../core/view.js'
import State from './state.js'
import Toast from './toast.js'
import { random } from 'tuvero'

class RandomPlacesButtonController extends Controller {
  constructor ($button) {
    super(new View(undefined, $button))
    this.view.$view.click(this.randomizeplaces.bind(this))
  }

  randomizeplaces () {
    const allmatches = []
    State.tournaments.forEach(function (tournament) {
      tournament.matches.forEach(function (match) {
        allmatches.push(match)
      })
    })
    const places = random.range(1, allmatches.length + 1)
    allmatches.forEach(function (match, index) {
      match.setPlace(places[index].toString())
    })
    return new Toast(allmatches.length + ' Bahnen/Plätze zugelost')
  }
}

export default RandomPlacesButtonController
