/**
 * PositiveMatrix: return only positive values
 *
 * @return PositiveMatrix
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'math/delegatematrix'], function(extend, DelegateMatrix) {
  /**
   * Constructor
   * @param matrix the matrix to bind itself to
   */
  function PositiveMatrix(matrix) {
    PositiveMatrix.superconstructor.call(this, matrix);
  }
  extend(PositiveMatrix, DelegateMatrix);

  /**
   * return only positive values
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return 0 if the actual value is negative, the value otherwise. undefined
   *          on error
   */
  PositiveMatrix.prototype.get = function(row, col) {
    var value = this.superget(row, col);
    if (value < 0) {
      return 0;
    }
    return value;
  };

  return PositiveMatrix;
});
