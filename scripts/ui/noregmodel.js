/**
 * NoRegModel
 *
 * @return NoRegModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/valuemodel', 'tournament/tournamentmodel'], function(
    extend, ValueModel, TournamentModel) {
  /**
   * Constructor
   */
  function NoRegModel(tournaments) {
    this.tournaments = tournaments;
    NoRegModel.superconstructor.call(this, this.isClosed());

    this.tournaments.registerListener(this);
    this.tournaments.closedTournaments.registerListener(this);
  }
  extend(NoRegModel, ValueModel);

  NoRegModel.prototype.isClosed = function() {
    var tournamentID;

    for (tournamentID = 0; tournamentID < this.tournaments.length; //
    tournamentID += 1) {
      if (this.tournaments.get(tournamentID).state.get() !== 'initial'
          || !this.tournaments.closedTournaments.includes(tournamentID)) {
        return true;
      }
    }

    return false;
  };

  NoRegModel.prototype.onupdate = function() {
    NoRegModel.superclass.set.call(this, this.isClosed());
  };

  NoRegModel.prototype.set = undefined;

  return NoRegModel;
});
