/**
 * A team in a list, a match table or a ranking row: clicking it
 * opens the team tab, which shows the team, its players and every
 * match it played.
 *
 * Names used to open a rename field right where they stood. The
 * team tab has proper inputs for that, and reaching a team's matches
 * mattered more than saving one click on a rename.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Controller from '../core/controller.js'
import State from './state.js'
import TabsHandle from './tabshandle.js'

const SELECTOR = '.teamno, .name, .teamname'

class TeamController extends Controller {
  constructor (view) {
    super(view)
    const open = this.openTeam.bind(this)
    this.view.$view.on('click', SELECTOR, open)
    this.view.$view.filter(SELECTOR).on('click', open)
  }

  openTeam () {
    State.focusedteam.set(this.model)
    TabsHandle.focus('team')
  }

  destroy () {
    if (State.focusedteam.get() === this.model) {
      State.focusedteam.set(undefined)
    }
    super.destroy()
  }
}

export default TeamController
