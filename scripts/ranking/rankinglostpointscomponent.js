import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingLostPointsComponent extends RankingComponent {
  /**
  * @param i
  *          a team index
  * @return the small points: won points, without subtracting lost points
  */
  value (i) {
    return this.ranking.lostpoints.get(i)
  }

  static NAME = 'lostpoints'
}

export default RankingLostPointsComponent
