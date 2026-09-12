import Controller from '../core/controller.js'
import Listener from '../core/listener.js'
import TimeMachine from '../timemachine/timemachine.js'
import ServerTournamentLoader from './servertournamentloader.js'

/**
 * Constructor
 */
class ServerTournamentController extends Controller {
  constructor (view) {
    super(view)
    this.view.$view.find('button.play').click(this.model.downloadState.bind(this.model))
    Listener.bind(this.model, 'ready', function () {
      ServerTournamentLoader.loadTournament(this.model)
    }, this)
    // Filter against the local tournament list, live: a row whose
    // tournament already sits in the list above is redundant and
    // hides; it returns the moment the local copy is deleted.
    // (Listener contract: TimeMachine.registerListener expects an
    // emitters array on the listener.)
    this.emitters = []
    this.updateHasLocal()
    TimeMachine.registerListener(this)
  }

  updateHasLocal () {
    const hasLocal = !!ServerTournamentLoader.findLocalCommit(this.model.alias)
    this.view.$view.toggleClass('haslocal', hasLocal)
  }

  onsave () {
    this.updateHasLocal()
  }

  onremove () {
    this.updateHasLocal()
  }

  oninit () {
    this.updateHasLocal()
  }

  onload () {
    this.updateHasLocal()
  }

  destroy () {
    TimeMachine.unregisterListener(this)
  }
}

export default ServerTournamentController
