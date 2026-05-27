import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the component chain
 */
class RankingHeadToHeadComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  /**
  * @param i
  *          a team index
  * @return the headtohead value, i.e. how often the team has won against
  *         another with the same number of wins
  */
  value (i) {
    return this.ranking.headtohead.get(i) || ''
  }

  static NAME = 'headtohead'
}

export default RankingHeadToHeadComponent
