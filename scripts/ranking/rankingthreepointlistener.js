/**
 * RankingThreePointListener
 *
 * @return RankingThreePointListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', //
'math/vectormodel'], function(extend, RankingDataListener, VectorModel) {

  /**
   * @param result
   *          a MatchResult instance
   * @return the index of the winner (for result.getTeamID(index)), or undefined
   *         if no unique winner exists
   */
  function getWinner(result) {
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

    return winner;
  }

  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingThreePointListener(ranking) {
    RankingThreePointListener.superconstructor.call(this, ranking, // autoformat
    new VectorModel());
  }
  extend(RankingThreePointListener, RankingDataListener);

  RankingThreePointListener.NAME = 'threepoint';
  RankingThreePointListener.DEPENDENCIES = undefined;

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
  RankingThreePointListener.prototype.onresult = function(r, e, result) {
    var winner, maxpoints;

    winner = getWinner(result);

    if (winner !== undefined) {
      this.threepoint.set(winner, this.threepoint.get(winner) + 3);
    } else {
      maxpoints = Math.max.apply(Math, result.score);
      result.teams.forEach(function (teamid, index) {
        if (result.score[index] === maxpoints) {
          this.threepoint.set(teamid, this.threepoint.get(teamid) + 1);
        }
      }, this);
    }
  };

  /**
   * add bye-related "threepoint"
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param teams
   *          an array of team ids
   */
  RankingThreePointListener.prototype.onbye = function(r, e, teams) {
    teams.forEach(function(teamid) {
      this.threepoint.set(teamid, this.threepoint.get(teamid) + 3);
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
  RankingThreePointListener.prototype.oncorrect = function(r, e, correction) {
    var winner, maxpoints;

    winner = getWinner(correction.before);

    if (winner !== undefined) {
      this.threepoint.set(winner, this.threepoint.get(winner) - 3);
    } else {
      maxpoints = Math.max.apply(Math, correction.before.score);
      correction.before.teams.forEach(function (teamid, index) {
        if (correction.before.score[index] === maxpoints) {
          this.threepoint.set(teamid, this.threepoint.get(teamid) - 1);
        }
      }, this);
    }

    this.onresult(r, e, correction.after);
  };

  return RankingThreePointListener;
});
