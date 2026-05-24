import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingPlacementListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  static NAME = 'placement';
}

export default RankingPlacementListener;