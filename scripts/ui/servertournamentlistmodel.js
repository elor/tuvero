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
    if (!data.logged_in) {
      return
    }
    // Chronological, soonest first. The API orders by start date,
    // but the response is a JSON object keyed by alias and Flask
    // sorts object keys alphabetically — so the order is lost on the
    // wire and has to be restored here. Undated tournaments sort
    // last.
    Object.keys(data.tournaments)
      .map(function (id) { return data.tournaments[id] })
      .filter(function (t) { return t.target === Presets.target })
      .sort(function (a, b) {
        return (a.startdate || '9999').localeCompare(b.startdate || '9999')
      })
      .forEach(function (tournamentData) {
        this.push(new ServerTournamentModel(this.server, tournamentData))
      }, this)
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
