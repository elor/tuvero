import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingIDComponent extends RankingComponent {
  constructor (ranking) {
    super(ranking, undefined)
  }

  /**
  * simply return the id. This always leads to a non-equal comparison.
  *
  * @param i
  *          a player index
  * @return the player index, for sorting
  */
  value (i) {
    return i
  }

  compare (i, k) {
    return -super.compare(i, k)
  }

  static NAME = 'id'
  static DEPENDENCIES = []
}

export default RankingIDComponent
