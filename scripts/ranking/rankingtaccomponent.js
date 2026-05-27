import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingTacComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  /**
  * @param i
  *          a team index
  * @return the point difference, aka. tac points
  */
  value (i) {
    return this.ranking.tac.get(i)
  }

  static NAME = 'tac'
}

export default RankingTacComponent
