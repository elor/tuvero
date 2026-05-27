import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingFormuleXComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  /**
  * @param i
  *          a team index
  * @return the point difference, aka. formulex points
  */
  value (i) {
    return this.ranking.formulex.get(i)
  }

  static NAME = 'formulex'
}

export default RankingFormuleXComponent
