/**
 * RankingGameMatrixListener: calculates the (symmetric) gamematrix from the
 * (asymmetric) winsmatrix by adding it to its transpose using a
 * TransposeSumMatrix.
 *
 * @return RankingGameMatrixListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './transposesummatrix'], //
function(extend, RankingDataListener, TransposeSumMatrix) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingGameMatrixListener(ranking) {
    RankingGameMatrixListener.superconstructor.call(this, ranking,
        new TransposeSumMatrix(ranking.winsmatrix));
  }
  extend(RankingGameMatrixListener, RankingDataListener);

  RankingGameMatrixListener.NAME = 'gamematrix';
  RankingGameMatrixListener.DEPENDENCIES = ['winsmatrix'];

  return RankingGameMatrixListener;
});
