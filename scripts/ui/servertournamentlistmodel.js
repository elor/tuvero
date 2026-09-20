import ListModel from '../list/listmodel.js'
import ServerTournamentModel from './servertournamentmodel.js'
import ValueModel from '../core/valuemodel.js'
import Presets from 'presets'

/*
 * The last response, kept in localStorage so the list is on screen
 * at once instead of popping in when the server answers. Shared by
 * the variants on purpose: it holds every tournament of the user,
 * and each variant picks its own target out of it.
 */
const CACHEKEY = 'servertournaments'

function readCache () {
  try {
    return JSON.parse(window.localStorage.getItem(CACHEKEY) || 'null')
  } catch (error) {
    return null
  }
}

function writeCache (data) {
  try {
    window.localStorage.setItem(CACHEKEY, JSON.stringify(data))
  } catch (error) {
    // a full or disabled storage is not worth a broken list
  }
}

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

    /**
     * true while a request is on its way -- the view says so
     * instead of showing an empty list
     */
    this.loading = new ValueModel(false)

    // the archive is a different, much larger query: only the
    // overview list caches
    this.cached = !this.lazy
    if (this.cached) {
      const cached = readCache()
      if (cached) {
        this.parseResult(cached)
      }
    }
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
    if (!message) {
      return
    }
    this.loading.set(true)
    message.onreceive = function (emitter, event, data) {
      this.parseResult(data)
      if (this.cached) {
        writeCache(data)
      }
    }.bind(this)
    message.oncomplete = function () {
      this.loading.set(false)
    }.bind(this)
    // a failed refresh keeps what is on screen: being offline is not
    // the same as having no tournaments
    message.send()
  }

  onlogin () {
    if (!this.lazy) {
      this.update()
    }
  }

  onlogout () {
    this.loading.set(false)
    this.clear()
    if (this.cached) {
      writeCache(null)
    }
  }

  onerror () {
    this.loading.set(false)
  }
}

export default ServerTournamentListModel
