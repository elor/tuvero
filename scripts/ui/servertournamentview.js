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
    // date and place sit left of the Online-Turnier link; empty
    // values disappear together with their separator dot
    const $startdate = this.$view.find('.serversource .startdate')
    if (model.startdate) {
      $startdate.text(new Date(model.startdate).toLocaleDateString('de', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }))
    } else {
      $startdate.hide()
      $startdate.next('.sep').hide()
    }
    const $place = this.$view.find('.serversource .place')
    if (model.place) {
      $place.text(model.place)
    } else {
      $place.hide()
      $place.next('.sep').hide()
    }
    this.$view.find('.creator').text(model.creator)
    this.$view.find('.teamsize').text(model.teamsize)
    this.$view.find('.url').text(model.url_www)
    this.$view.find('a.url_href').attr('href', model.url_www)
    this.controller = new ServerTournamentController(this)
  }

  destroy () {
    // rows are re-rendered on every list refresh; drop the
    // controller's TimeMachine listener with them
    this.controller.destroy()
    super.destroy()
  }
}

export default ServerTournamentView
