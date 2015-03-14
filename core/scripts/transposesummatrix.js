/**
 * TransposeSumMatrix: the sum of a matrix and its transpose.
 *
 * Example use in a tournament: If matrix is a matrix with the number of wins
 * (1) and draws (1/2) against every opponent, TransposeSumMatrix(matrix) is the
 * number of games against an opponent, so long as the main diagonal is zero.
 *
 * @return TransposeSumMatrix
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './delegatematrix'], function(extend, DelegateMatrix) {
  /**
   * Constructor
   *
   * @param matrix
   *          the matrix to bind itself to
   */
  function TransposeSumMatrix(matrix) {
    TransposeSumMatrix.superconstructor.call(this, matrix);
  }
  extend(TransposeSumMatrix, DelegateMatrix);

  /**
   * return only positive values
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return get(row, col)+get(col, row), i.e. (A + A^T)
   */
  TransposeSumMatrix.prototype.get = function(row, col) {
    var v1, v2;
    v1 = this.superget(row, col);
    v2 = this.superget(col, row);
    if (v1 === undefined || v2 === undefined) {
      return undefined;
    }
    return v1 + v2;
  };

  return TransposeSumMatrix;
});
