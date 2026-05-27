import View from '../core/view.js'
import TeamSizeController from './teamsizecontroller.js'

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance which represents the team size
 */
class TeamSizeView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.$buttons = this.$view.find('>button')
    this.update()
    this.controller = new TeamSizeController(this)
  }

  /**
   * unselect all buttons and select the current one.
   *
   * When driven by update events, ValueModel.set() should avoid sending events
   * when the new and old values match, i.e. there's no actual change
   */
  update () {
    const teamsize = this.model.get()
    this.$buttons.removeClass('selected')
    this.$buttons.eq(teamsize - 1).addClass('selected')
  }

  /**
   * Callback function
   */
  onupdate () {
    this.update()
  }
}

export default TeamSizeView
