import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'
import Options from 'options'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingPointsListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new VectorModel())
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
    result.teams.forEach(function (teamid, index) {
      this.points.add(teamid, result.score[index])
    }, this)
  }

  /**
   * add bye points
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
      this.points.add(teamid, Options.byepointswon)
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
    correction.before.teams.forEach(function (teamid, index) {
      this.points.add(teamid, -correction.before.score[index])
    }, this)
    this.onresult(r, e, correction.after)
  }

  static NAME = 'points'
  static DEPENDENCIES = undefined
}

export default RankingPointsListener
