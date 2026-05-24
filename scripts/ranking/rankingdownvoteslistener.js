import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingDownvotesListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  /**
   * override the 'isPrimary()' function: Don't check for specialties, just make
   * it save stuff.
   *
   * @return true
   */
  isPrimary() {
    return true;
  }

  static NAME = 'downvotes';
  static DEPENDENCIES = undefined;
}

export default RankingDownvotesListener;