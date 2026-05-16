/**
 * RankingGameMatrixListener: calculates the (symmetric) gamematrix from the
 * (asymmetric) winsmatrix by adding it to its transpose using a
 * TransposeSumMatrix.
 *
 * @return RankingGameMatrixListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RankingDataListener from './rankingdatalistener.js';
import TransposeSumMatrix from '../math/transposesummatrix.js';
/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
function RankingGameMatrixListener(ranking) {
  RankingGameMatrixListener.superconstructor.call(this, ranking, new TransposeSumMatrix(ranking.winsmatrix));
}
extend(RankingGameMatrixListener, RankingDataListener);
RankingGameMatrixListener.NAME = 'gamematrix';
RankingGameMatrixListener.DEPENDENCIES = ['winsmatrix'];
export default RankingGameMatrixListener;