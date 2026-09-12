import Controller from '../core/controller.js'
import Listener from '../core/listener.js'
import ServerTournamentLoader from './servertournamentloader.js'

/**
 * Constructor
 */
class ServerTournamentController extends Controller {
  constructor (view) {
    super(view)
    // A local copy exists: mark the row — opening will reuse it
    // instead of downloading (dedup in ServerTournamentLoader).
    if (ServerTournamentLoader.findLocalCommit(this.model.alias)) {
      this.view.$view.addClass('haslocal')
      this.view.$view.find('.serversource').text('Lokale Kopie vorhanden')
    }
    this.view.$view.find('button.play').click(this.model.downloadState.bind(this.model))
    Listener.bind(this.model, 'ready', function () {
      ServerTournamentLoader.loadTournament(this.model)
    }, this)
  }
}

export default ServerTournamentController
