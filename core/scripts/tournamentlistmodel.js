/**
 * TournamentListModel: A list of tournaments, which can be used to determine
 * the current tournament and global rank for each player.
 *
 * @return TournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedlistmodel'//
], function(extend, IndexedListModel) {
  /**
   * Constructor
   *
   * @param teams
   *          a ListModel of TeamModel instances
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

  return TournamentListModel;
});
