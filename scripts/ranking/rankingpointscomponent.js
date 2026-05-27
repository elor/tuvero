import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingPointsComponent extends RankingComponent {
  /**
  * @param i
  *          a team index
  * @return the small points: won points, without subtracting lost points
  */
  value (i) {
    return this.ranking.points.get(i)
  }

  static NAME = 'points'
}

export default RankingPointsComponent
