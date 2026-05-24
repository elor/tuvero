import DelegateMatrix from './delegatematrix.js';

/**
 * Constructor
 *
 * @param matrix
 *          the matrix to bind itself to
 */
class AbsoluteMatrix extends DelegateMatrix {
  constructor(matrix) {
    super(matrix);
  }

  /**
   * return the absolute value at the given position
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return the absolute value at position (row,col)
   */
  get(row, col) {
    const value = this.superget(row, col);
    if (value < 0) {
      return -value;
    }
    return value;
  }
}

export default AbsoluteMatrix;