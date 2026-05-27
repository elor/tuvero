import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingSaldoComponent extends RankingComponent {
  /**
  * @param i
  *          a team index
  * @return the point difference, aka. saldo points
  */
  value (i) {
    return this.ranking.saldo.get(i)
  }

  static NAME = 'saldo'
}

export default RankingSaldoComponent
