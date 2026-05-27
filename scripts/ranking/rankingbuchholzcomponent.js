import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingBuchholzComponent extends RankingComponent {

  /**
  * @param i
  *          a team index
  * @return the number of won games
  */
  value (i) {
    return this.ranking.buchholz.get(i)
  }

  static NAME = 'buchholz'
}

export default RankingBuchholzComponent
