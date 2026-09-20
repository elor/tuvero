import View from '../core/view.js'
import Listener from '../core/listener.js'
import TeamSettingsController from './teamsettingscontroller.js'

class TeamSettingsView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.controller = new TeamSettingsController(this)
    this.update()
  }

  update () {
    this.$view.find('.teamid').text(this.model.getID() + 1)
    this.$view.find('.teamnumber').val(this.model.number)
    this.$view.find('.alias').val(this.model.alias)
    this.$view.find('.club').val(this.model.club)
    this.$view.find('.rankingpoints').val(this.model.rankingpoints)
    this.$view.find('.elo').val(this.model.elo)
  }

  onupdate () {
    this.update()
  }

  /**
   * The form belongs to the team tab, which fills it for the next
   * team: unbind, but leave the markup where it is. (The View
   * default removes its element, which is right for list rows and
   * wrong here.)
   */
  destroy () {
    this.controller.destroy()
    Listener.prototype.destroy.call(this)
  }

  static bindTeamList (teamlist) {
    class IndexTeamView extends TeamSettingsView {
      constructor (teamID, $view) {
        super(teamlist.get(teamID), $view)
      }
    }

    return IndexTeamView
  }
}

export default TeamSettingsView
