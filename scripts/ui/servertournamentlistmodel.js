import ListModel from '../list/listmodel.js'
import ServerTournamentModel from './servertournamentmodel.js'
import Presets from 'presets'

/**
   * Constructor
   */
class ServerTournamentListModel extends ListModel {
  constructor (server) {
    super()
    this.server = server
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
    const message = this.server.message('t', {
      publiconly: false,
      showarchive: true
    })
    message.onreceive = function (emitter, event, data) {
      this.parseResult(data)
    }.bind(this)
    message.onerror = this.clear.bind(this)
    message.send()
  }

  onlogin () {
    this.update()
  }

  onlogout () {
    this.clear()
  }

  onerror () {
    this.clear()
  }
}

export default ServerTournamentListModel
