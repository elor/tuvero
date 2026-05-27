import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingWinsListener extends RankingDataListener {
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
    const winner = result.getWinner()
    if (winner !== undefined) {
      this.wins.add(winner, 1)
    }
  }

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
  onbye (r, e, data) {
    data.teams.forEach(function (teamid) {
      this.wins.add(teamid, 1)
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
    const winner = correction.before.getWinner()
    if (winner !== undefined) {
      this.wins.set(winner, this.wins.get(winner) - 1)
    }
    this.onresult(r, e, correction.after)
  }

  static NAME = 'wins'
  static DEPENDENCIES = undefined
}

export default RankingWinsListener
