import View from '../core/view.js'
import BoxView from './boxview.js'
import ServerTournamentController from './servertournamentcontroller.js'

/**
 * Constructor
 */
class ServerTournamentView extends View {
  constructor (model, $view) {
    super(model, $view)
    // real BoxView like the local tournament boxes: same title bar,
    // working minimize control
    this.boxView = new BoxView(this.$view)
    this.$view.find('.name').text(model.name)
    this.$view.find('.place').text(model.place)
    this.$view.find('.creator').text(model.creator)
    this.$view.find('.teamsize').text(model.teamsize)
    this.$view.find('.url').text(model.url_www)
    this.$view.find('a.url_href').attr('href', model.url_www)
    this.controller = new ServerTournamentController(this)
  }
}

export default ServerTournamentView
