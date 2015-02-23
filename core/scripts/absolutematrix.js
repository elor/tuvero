/**
 * AbsoluteMatrix: return the absolute of all values
 *
 * @return AbsoluteMatrix
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './delegatematrix'], function(extend, DelegateMatrix) {
  /**
   * Constructor
   */
  function AbsoluteMatrix(matrix) {
    AbsoluteMatrix.superconstructor.call(this, matrix);
  }
  extend(AbsoluteMatrix, DelegateMatrix);

  /**
   * return the absolute value at the given position
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return the absolute value at position (row,col)
   */
  AbsoluteMatrix.prototype.get = function(row, col) {
    var value = this.superget(row, col);
    if (value < 0) {
      return -value;
    }
    return value;
  };

  return AbsoluteMatrix;
});
