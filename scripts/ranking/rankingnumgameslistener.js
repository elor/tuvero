/**
 * RankingNumGamesListener
 *
 * @return RankingNumGamesListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ranking/rankingdatalistener", "math/vectormodel"], function (
    extend, RankingDataListener, VectorModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingNumGamesListener(ranking) {
    RankingNumGamesListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingNumGamesListener, RankingDataListener);

  RankingNumGamesListener.NAME = "numgames";
  RankingNumGamesListener.DEPENDENCIES = undefined;

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  RankingNumGamesListener.prototype.onresult = function (r, e, result) {
    result.teams.forEach(function (teamid) {
      this.numgames.add(teamid, 1);
    }, this);
  };

  /**
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param teams
   *          an array of team ids
   */
  RankingNumGamesListener.prototype.onbye = function (r, e, teams) {
    teams.forEach(function (teamid) {
      this.numgames.add(teamid, 1);
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "correct"
   * @param correction
   *          a game correction
   */
  RankingNumGamesListener.prototype.oncorrect = function (r, e, correction) {
    correction.before.teams.forEach(function (teamid) {
      this.numgames.set(teamid, this.numgames.get(teamid) - 1);
    }, this);

    this.onresult(r, e, correction.after);
  };

  return RankingNumGamesListener;
});
