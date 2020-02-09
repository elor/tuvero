/**
 * RankingTwoPointListener
 *
 * @return RankingTwoPointListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define([
  'lib/extend',
  'ranking/rankingdatalistener',
  'math/vectormodel'
], function (extend, RankingDataListener, VectorModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingTwoPointListener (ranking) {
    RankingTwoPointListener.superconstructor.call(this, ranking, // autoformat
      new VectorModel())
  }
  extend(RankingTwoPointListener, RankingDataListener)

  RankingTwoPointListener.NAME = 'twopoint'
  RankingTwoPointListener.DEPENDENCIES = undefined

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
  RankingTwoPointListener.prototype.onresult = function (r, e, result) {
    var winner, maxpoints

    winner = result.getWinner()

    if (winner !== undefined) {
      this.twopoint.add(winner, 2)
    } else {
      maxpoints = Math.max.apply(Math, result.score)
      result.teams.forEach(function (teamid, index) {
        if (result.score[index] === maxpoints) {
          this.twopoint.add(teamid, 1)
        }
      }, this)
    }
  }

  /**
   * add bye-related "twopoint"
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param teams
   *          an array of team ids
   */
  RankingTwoPointListener.prototype.onbye = function (r, e, data) {
    var teams, round
    teams = data.teams
    round = data.round
    teams.forEach(function (teamid) {
      this.twopoint.add(teamid, 2)
    }, this)
  }

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
  RankingTwoPointListener.prototype.oncorrect = function (r, e, correction) {
    var winner, maxpoints

    winner = correction.before.getWinner()

    if (winner !== undefined) {
      this.twopoint.set(winner, this.twopoint.get(winner) - 2)
    } else {
      maxpoints = Math.max.apply(Math, correction.before.score)
      correction.before.teams.forEach(function (teamid, index) {
        if (correction.before.score[index] === maxpoints) {
          this.twopoint.set(teamid, this.twopoint.get(teamid) - 1)
        }
      }, this)
    }

    this.onresult(r, e, correction.after)
  }

  return RankingTwoPointListener
})
