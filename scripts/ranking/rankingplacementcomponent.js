import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingPlacementComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  isPrimary () {
    return false
  }

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  value (i) {
    return 1 + i - i % 2
  }

  compare (i, k) {
    return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k)
  }

  static NAME = 'placement'
}

export default RankingPlacementComponent
