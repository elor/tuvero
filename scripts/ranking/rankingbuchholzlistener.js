import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingBuchholzListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  onrecalc() {
    this.gamematrix.multVector(this.buchholz, this.wins);
  }

  static NAME = 'buchholz';
  static DEPENDENCIES = ['gamematrix', 'wins'];
}

export default RankingBuchholzListener;