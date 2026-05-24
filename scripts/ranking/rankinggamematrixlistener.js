import RankingDataListener from './rankingdatalistener.js';
import TransposeSumMatrix from '../math/transposesummatrix.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingGameMatrixListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new TransposeSumMatrix(ranking.winsmatrix));
  }

  static NAME = 'gamematrix';
  static DEPENDENCIES = ['winsmatrix'];
}

export default RankingGameMatrixListener;