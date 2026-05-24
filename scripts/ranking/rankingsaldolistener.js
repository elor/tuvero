import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingSaldoListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  onrecalc() {
    this.saldo.sum(this.points, this.lostpoints);
  }

  static NAME = 'saldo';
  static DEPENDENCIES = ['points', 'lostpoints'];
}

export default RankingSaldoListener;