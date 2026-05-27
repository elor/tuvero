import Controller from '../core/controller.js'
import State from './state.js'
import Toast from './toast.js'
import Strings from './strings.js'

class TeamSettingsController extends Controller {
  constructor (view) {
    super(view)
    this.reset = this.reset.bind(this)
    this.update = this.update.bind(this)
    this.enterkey = function (e) {
      if (e.which === 13) {
        this.update()
      }
    }.bind(this)
    this.register()
  }

  register () {
    this.view.$view.on('click', 'button.reset', this.reset)
    this.view.$view.on('click', 'button.update', this.update)
    this.view.$view.on('keypress', 'input', this.enterkey)
  }

  unregister () {
    this.view.$view.off('click', 'button.reset', this.reset)
    this.view.$view.off('click', 'button.update', this.update)
    this.view.$view.off('keypress', 'input', this.enterkey)
  }

  reset () {
    this.view.update()
    Toast.once(Strings.team_settings_reset)
  }

  update () {
    this.model.number = this.view.$view.find('.teamnumber').val()
    this.model.alias = this.view.$view.find('.alias').val()
    this.model.club = this.view.$view.find('.club').val()
    this.model.rankingpoints = Number(this.view.$view.find('.rankingpoints').val())
    this.model.elo = Number(this.view.$view.find('.elo').val())
    Toast.once(Strings.team_settings_updated)
    this.model.emit('update')
  }

  destroy () {
    this.unregister()
    super.destroy()
  }
}

export default TeamSettingsController
