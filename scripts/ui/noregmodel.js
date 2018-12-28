define(['lib/extend', 'core/valuemodel'], function (extend, ValueModel) {
  function NoRegModel (tournaments) {
    this.tournaments = tournaments
    NoRegModel.superconstructor.call(this, this.isClosed())

    this.tournaments.registerListener(this)
    this.tournaments.closedTournaments.registerListener(this)
  }
  extend(NoRegModel, ValueModel)

  NoRegModel.prototype.isClosed = function () {
    return this.tournaments.asArray().some(function (tournament) {
      return tournament.state.get() !== 'initial' ||
        !this.tournaments.closedTournaments.includes(tournament.getID())
    }, this)
  }

  NoRegModel.prototype.onupdate = function () {
    NoRegModel.superclass.set.call(this, this.isClosed())
  }

  NoRegModel.prototype.set = undefined

  return NoRegModel
})
