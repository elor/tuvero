/**
 * AbsoluteMatrix: return the absolute of all values
 *
 * @return AbsoluteMatrix
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import DelegateMatrix from './delegatematrix.js';
/**
 * Constructor
 *
 * @param matrix
 *          the matrix to bind itself to
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
AbsoluteMatrix.prototype.get = function (row, col) {
  const value = this.superget(row, col);
  if (value < 0) {
    return -value;
  }
  return value;
};
export default AbsoluteMatrix;