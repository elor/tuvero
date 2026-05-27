import Controller from '../core/controller.js'
import View from '../core/view.js'
import State from './state.js'
import Toast from './toast.js'

class FixTeamNumberController extends Controller {
  constructor ($button) {
    super(new View(undefined, $button))
    this.view.$view.click(this.fixteamnumbers.bind(this))
  }

  fixteamnumbers () {
    State.teams.forEach(function (team) {
      if (team.number === undefined || team.number === '') {
        team.number = '' + (team.id + 1)
      }
    })
    return new Toast('Teamnummern zugewiesen')
  }
}

export default FixTeamNumberController
