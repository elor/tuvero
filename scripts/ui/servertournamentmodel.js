import Model from '../core/model.js'
import Toast from './toast.js'
import Strings from './strings.js'

/**
 * Constructor
 */
class ServerTournamentModel extends Model {
  constructor (server, data) {
    super()
    this.id = data.id || undefined
    this.name = data.name
    this.place = data.place
    this.creator = data.creator_name
    this.teamsize = data.teamsize
    this.variant = data.target
    // Prefer url_tournament (resolves against the current API host)
    // over url_www (hardcoded https://www.tuvero.de) so the variant
    // doesn't bounce users out of localhost in dev / staging.
    this.url_www = data.url_tournament || data.url_www
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
