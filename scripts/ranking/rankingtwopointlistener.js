import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingTwoPointListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, // autoformat
      new VectorModel())
  }

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
  onresult (r, e, result) {
    let maxpoints
    const winner = result.getWinner()
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
  onbye (r, e, data) {
    data.teams.forEach(function (teamid) {
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
  oncorrect (r, e, correction) {
    let maxpoints
    const winner = correction.before.getWinner()
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

  static NAME = 'twopoint'
  static DEPENDENCIES = undefined
}

export default RankingTwoPointListener
