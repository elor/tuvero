/**
 * RankingHeadToHeadMatrixListener: calculates the (antisymmetric)
 * headtoheadmatrix from the (asymmetric) winsmatrix by subtracting its
 * transpose from it with a TransposeDifferenceMatrix.
 *
 * @return RankingHeadToHeadMatrixListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './transposedifferencematrix'],//
function(extend, RankingDataListener, TransposeDifferenceMatrix) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingHeadToHeadMatrixListener(ranking) {
    RankingHeadToHeadMatrixListener.superconstructor.call(this, ranking,
        new TransposeDifferenceMatrix(ranking.winsmatrix));
  }
  extend(RankingHeadToHeadMatrixListener, RankingDataListener);

  RankingHeadToHeadMatrixListener.NAME = 'headtoheadmatrix';
  RankingHeadToHeadMatrixListener.DEPENDENCIES = ['winsmatrix'];

  return RankingHeadToHeadMatrixListener;
});
