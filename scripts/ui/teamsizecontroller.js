/**
 * @return TeamSizeController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'

/**
 * Constructor
 *
 * @param view
 *          the TeamSizeView
 */
class TeamSizeController extends Controller {
  constructor (view) {
    super(view)
    const $buttons = this.view.$buttons
    const model = this.model

    /**
     * adjust the team size: get the index of the clicked button and calculate
     * the team size from it. Increment and set.
     */
    $buttons.click(function () {
      const teamsize = $buttons.index($(this)) + 1
      if (teamsize > 0) {
        model.set(teamsize)
      }
    })
  }
}

export default TeamSizeController
