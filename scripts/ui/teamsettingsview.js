import View from '../core/view.js'
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

  destroy () {
    this.controller.destroy()
    super.destroy()
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
