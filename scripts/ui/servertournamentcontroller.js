import Controller from '../core/controller.js'
import Listener from '../core/listener.js'
import ServerTournamentLoader from './servertournamentloader.js'

/**
 * Constructor
 */
class ServerTournamentController extends Controller {
  constructor (view) {
    super(view)
    // A local copy exists: the tournament already sits in the local
    // list above, so the server row is redundant and stays hidden.
    if (ServerTournamentLoader.findLocalCommit(this.model.alias)) {
      this.view.$view.addClass('haslocal')
    }
    this.view.$view.find('button.play').click(this.model.downloadState.bind(this.model))
    Listener.bind(this.model, 'ready', function () {
      ServerTournamentLoader.loadTournament(this.model)
    }, this)
  }
}

export default ServerTournamentController
