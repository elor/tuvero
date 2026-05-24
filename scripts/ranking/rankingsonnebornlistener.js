import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingSonnebornListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  onrecalc() {
    // TODO exclude bye from sonneborn points?
    this.winsmatrix.multVector(this.sonneborn, this.wins);
  }

  static NAME = 'sonneborn';
  static DEPENDENCIES = ['winsmatrix', 'wins'];
}

export default RankingSonnebornListener;