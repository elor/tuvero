/**
 * TransposeDifferenceMatrix: the difference of a matrix and its transpose.
 *
 * If the matrix is a "winsmatrix", its TransposeDifferenceMatrix shows who has
 * won. get(i,k) > 0: i has won. get(i,k) < 0: k has won. Otherwise: draw.
 *
 * @return TransposeDifferenceMatrix
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
  function TransposeDifferenceMatrix(matrix) {
    TransposeDifferenceMatrix.superconstructor.call(this, matrix);
  }
  extend(TransposeDifferenceMatrix, DelegateMatrix);

  /**
   * return only positive values
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return get(row, col)+get(col, row), i.e. (A + A^T)
   */
  TransposeDifferenceMatrix.prototype.get = function(row, col) {
    var v1, v2;
    v1 = this.superget(row, col);
    v2 = this.superget(col, row);
    if (v1 === undefined || v2 === undefined) {
      return undefined;
    }
    return v1 - v2;
  };

  return TransposeDifferenceMatrix;
});
