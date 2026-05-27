import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingByeListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, // autoformat
      new VectorModel())
  }

  /**
   * accumulate byes
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
      this.byes.add(teamid, 1)
    }, this)
  }

  static NAME = 'byes'
  static DEPENDENCIES = undefined
}

export default RankingByeListener
