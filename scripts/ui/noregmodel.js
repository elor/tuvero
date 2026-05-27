import ValueModel from '../core/valuemodel.js'

class NoRegModel extends ValueModel {
  constructor (tournaments) {
    const isClosed = () => tournaments.asArray().some(function (tournament) {
      return tournament.state.get() !== 'initial' || !tournaments.closedTournaments.includes(tournament.getID())
    })
    super(isClosed())
    this.tournaments = tournaments
    this.tournaments.registerListener(this)
    this.tournaments.closedTournaments.registerListener(this)
  }

  isClosed () {
    return this.tournaments.asArray().some(function (tournament) {
      return tournament.state.get() !== 'initial' || !this.tournaments.closedTournaments.includes(tournament.getID())
    }, this)
  }

  onupdate () {
    super.set(this.isClosed())
  }
}

NoRegModel.prototype.set = undefined
export default NoRegModel
