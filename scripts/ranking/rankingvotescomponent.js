import RankingComponent from './rankingcomponent.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingVotesComponent extends RankingComponent {
  constructor (ranking, nextcomponent) {
    super(ranking, nextcomponent)
  }

  /**
  * @param i
  *          a team index
  * @return a string representation of the votes
  */
  value (i) {
    return this.ranking.votes.get(i)
  }

  /**
  * skip this component for ranking. It's not a valid component, just a
  * visualization
  *
  * @return the result of the next component's ranking
  */
  compare (i, k) {
    return this.nextcomponent.compare(i, k)
  }

  static NAME = 'votes'
}

export default RankingVotesComponent
