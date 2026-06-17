import Model from '../core/model.js'
import Toast from './toast.js'
import Strings from './strings.js'

/**
 * Constructor
 */
class ServerTournamentModel extends Model {
  constructor (server, data) {
    super()
    // The API exposes tournaments by alias, not numeric id. Old
    // responses (legacy /graph era) shipped data.id; keep it as a
    // fallback so rebuilt-against-old-server combos still work.
    this.id = data.alias || data.id || undefined
    this.name = data.name
    this.place = data.place
    this.creator = data.creator_name
    this.teamsize = data.teamsize
    this.variant = data.target
    // url_www is the canonical, shareable URL the variant exposes in
    // "Online-Voranmeldungen" so the organizer can hand it to players.
    // Production sets CANONICAL_WEB_ORIGIN=https://www.tuvero.de;
    // staging/local dev get an honest fallback to whatever host the
    // API request used. We do *not* fall through to url_tournament
    // (which is the API host, e.g. api.tuvero.de) -- that URL works
    // as an API endpoint but not as a human-facing one.
    this.url_www = data.url_www
    this.statejson = undefined
    this.server = server
    this.server.registerListener(this)
  }

  downloadState () {
    const message = this.server.message('t/' + this.id + '/state/latest/state')
    if (!message) {
      Toast.once(Strings.state_download_failed)
      this.emit('error')
      return
    }
    const downloadToast = Toast.once(Strings.state_downloading, Toast.INFINITE)
    message.onreceive = function (emitter, event, statejson) {
      if (!statejson.error) {
        this.statejson = statejson
        this.emit('ready')
      } else {
        Toast.once(statejson.error || Strings.state_download_failed)
        this.emit('error')
      }
    }.bind(this)
    message.onerror = function () {
      Toast.once(Strings.state_download_failed)
      this.emit('error')
    }.bind(this)
    message.oncomplete = function () {
      downloadToast.close()
    }
    message.send()
  }
}

ServerTournamentModel.prototype.EVENTS = {
  error: true,
  ready: true
}
export default ServerTournamentModel
