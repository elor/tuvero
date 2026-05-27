import View from '../core/view.js'
import PlayerSettingsController from './playersettingscontroller.js'
import PlayerModel from './playermodel.js'

class PlayerSettingsView extends View {
  constructor (model, $view, teamref) {
    super(model, $view)
    this.controller = new PlayerSettingsController(this, teamref)
    this.update()
  }

  update () {
    this.$view.find('.alias').val(this.model.alias === PlayerModel.NONAME ? '' : this.model.alias)
    this.$view.find('.firstname').val(this.model.firstname)
    this.$view.find('.lastname').val(this.model.lastname)
    this.$view.find('.club').val(this.model.club)
    this.$view.find('.email').val(this.model.email)
    this.$view.find('.license').val(this.model.license)
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
    class IndexTeamView extends PlayerSettingsView {
      constructor (teamID, $view) {
        super(teamlist.get(teamID), $view)
      }
    }

    return IndexTeamView
  }
}

export default PlayerSettingsView
