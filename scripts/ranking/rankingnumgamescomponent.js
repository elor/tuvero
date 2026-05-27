import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingNumGamesComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  /**
  * @param i
  *          a team index
  * @return the number of won games
  */
  value (i) {
    return this.ranking.numgames.get(i)
  }

  static NAME = 'numgames'
}

export default RankingNumGamesComponent
