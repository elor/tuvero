/**
 * RankingWinsListener
 *
 * @return RankingWinsListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', //
'./vectormodel'], function(extend, RankingDataListener, VectorModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingWinsListener(ranking) {
    RankingWinsListener.superconstructor.call(this, ranking, // autoformat
    new VectorModel());
  }
  extend(RankingWinsListener, RankingDataListener);

  RankingWinsListener.NAME = 'wins';
  RankingWinsListener.DEPENDENCIES = undefined;

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
  RankingWinsListener.prototype.onresult = function(r, e, result) {
    var winner, maxpoints;

    winner = undefined;
    maxpoints = undefined;

    result.teams.forEach(function(teamid, index) {
      var points;
      points = result.score[index];
      if (maxpoints === undefined || points > maxpoints) {
        winner = teamid;
        maxpoints = points;
      } else if (points === maxpoints) {
        winner = undefined;
      }
    }, this);

    if (winner !== undefined) {
      this.wins.set(winner, this.wins.get(winner) + 1);
    }
  };

  /**
   * add bye-related "wins"
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param teams
   *          an array of team ids
   */
  RankingWinsListener.prototype.onbye = function(r, e, teams) {
    teams.forEach(function(teamid) {
      this.wins.set(teamid, this.wins.get(teamid) + 1);
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param correction
   *          a game correction
   */
  RankingWinsListener.prototype.oncorrect = function(r, e, correction) {
    console.error('RankingWinsListener.oncorrect() not implemented yet');
  };

  return RankingWinsListener;
});
