import RankingComponent from './rankingcomponent.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
class RankingFinebuchholzComponent extends RankingComponent {
  constructor(ranking, nextcomponent) {
    super(ranking, nextcomponent);
  }

  /**
  * @param i
  *          a team index
  * @return the number of won games
  */
  value(i) {
    return this.ranking.finebuchholz.get(i);
  }

  static NAME = 'finebuchholz';
}

export default RankingFinebuchholzComponent;