/**
 * TournamentListModel: A list of tournaments, which can be used to determine
 * the current tournament and global rank for each player.
 *
 * @return TournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedlistmodel', './tournamentindex'], function(
    extend, IndexedListModel, TournamentIndex) {
  /**
   * Constructor
   */
  function TournamentListModel() {
    TournamentListModel.superconstructor.call(this);
  }
  extend(TournamentListModel, IndexedListModel);

  /**
   * TODO should use the event system. Benchmark first!
   *
   * @return an array of tournament IDs for every team in a tournament
   */
  TournamentListModel.prototype.tournamentIDsForEachTeam = function() {
    var ids = [];

    this.map(function(tournament) {
      if (tournament.getState().get() != "finished") {
        tournament.getTeams().map(function(team) {
          ids[team] = tournament.getID();
        });
      }
    });

    return ids;
  };

  TournamentListModel.prototype.getGlobalRanking = function() {
    // TODO do something
  };

  // TournamentListModel.prototype.save is directly inherited from ListModel

  /**
   * restores tournaments from savedata objects. This function is used to
   * enforce the usage of TournamentIndex.createTournament as a factory. The
   * other logic is embedded into ListModel, which in turn constructs
   * TournamentModel instances.
   *
   * @param data
   *          a data object, as returned from this.save();
   * @return true on success, false otherwise
   */
  TournamentListModel.prototype.restore = function(data) {
    return TournamentListModel.superclass.restore.call(this, data,
        TournamentIndex.createTournament);
  };

  TournamentListModel.prototype.SAVEFORMAT = [Object];

  return TournamentListModel;
});
