import ListModel from '../list/listmodel.js'
import ServerTournamentModel from './servertournamentmodel.js'
import Presets from 'presets'

/**
   * Constructor
   */
class ServerTournamentListModel extends ListModel {
  /**
   * @param server the ServerModel
   * @param sinceDays how far back to ask for, in days. Undefined
   *        means the whole archive — that is what the "Vom Server
   *        öffnen" dialog wants; the overview asks for the recent
   *        window so the archive isn't transferred at all.
   */
  constructor (server, sinceDays, lazy) {
    super()
    this.server = server
    this.sinceDays = sinceDays
    // lazy lists don't fetch on login; the caller triggers update()
    // when the data is actually shown
    this.lazy = !!lazy
    this.server.registerListener(this)
  }

  parseResult (data) {
    this.clear()
    if (data.logged_in) {
      Object.keys(data.tournaments).forEach(function (tournamentID) {
        let tournament
        const tournamentData = data.tournaments[tournamentID]
        if (tournamentData.target === Presets.target) {
          tournament = new ServerTournamentModel(this.server, tournamentData)
          this.push(tournament)
        }
      }, this)
    }
  }

  update () {
    // /me/tournaments is the variant-shaped list: only tournaments
    // the caller created. /t is the browseable own + public list,
    // which the variant doesn't want -- users would see other
    // peoples' rows they can't actually act on.
    let path = 'me/tournaments'
    if (this.sinceDays !== undefined) {
      const since = new Date()
      since.setDate(since.getDate() - this.sinceDays)
      path += '?since=' + since.toISOString().slice(0, 10)
    }
    const message = this.server.message(path)
    message.onreceive = function (emitter, event, data) {
      this.parseResult(data)
    }.bind(this)
    message.onerror = this.clear.bind(this)
    message.send()
  }

  onlogin () {
    if (!this.lazy) {
      this.update()
    }
  }

  onlogout () {
    this.clear()
  }

  onerror () {
    this.clear()
  }
}

export default ServerTournamentListModel
