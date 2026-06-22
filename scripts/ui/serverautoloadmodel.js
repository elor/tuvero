import Model from '../core/model.js'
import Browser from './browser.js'
import ServerTournamentModel from './servertournamentmodel.js'
import ServerTournamentLoader from './servertournamentloader.js'
import Presets from 'presets'
import Listener from '../core/listener.js'

/**
 * Constructor
 *
 * @param  {ServerModel} server the currently active ServerModel instance
 * @returns {undefined}
 */
class ServerAutoloadModel extends Model {
  constructor (server) {
    super()
    this.server = server
    this.tournamentID = this.readTournamentID()
    this.server.registerListener(this)

    // The hash points at a server-side tournament we want to load
    // -- but onlogin() only fires *after* a valid token exists.
    // Kick the token mint ourselves so a one-click autoload works
    // for users who already have a Flask session cookie (silent
    // mint via /profile/token/new/json) and falls back to the
    // login popup when they don't. Without this the link looks
    // broken until the user opens the login popup manually.
    if (this.tournamentID && !this.server.token.get()) {
      this.server.createToken()
    }
  }

  readTournamentID () {
    let testresult
    if (Browser.inithash) {
      // Accept anything that looks like an alias or a numeric id.
      // Aliases use the same [A-Za-z0-9] set the server auto-
      // generator emits (e.g. "sommer26", "oNHOr"); numeric legacy
      // ids fall through the same character class.
      testresult = Browser.inithash.match(/^\/?t\/([A-Za-z0-9]+)$/)
      if (testresult && testresult[0] && testresult[1]) {
        return testresult[1]
      }
    }
    return undefined
  }

  /**
   * event function
   *
   * @returns {undefined}
   */
  onlogin () {
    let message
    if (this.tournamentID) {
      message = this.server.message('t/' + this.tournamentID)
      message.onreceive = function (emitter, event, data) {
        if (data && data.registrations && data.target === Presets.target) {
          const model = new ServerTournamentModel(this.server, data)
          Listener.bind(model, 'ready', function () {
            ServerTournamentLoader.loadTournament(model)
          })
          model.downloadState()
          if (window.location.hash.replace(/^#/, '') === Browser.inithash) {
            window.location.hash = ''
          }
        }
      }.bind(this)
      message.send()
    }
  }
}

export default ServerAutoloadModel
