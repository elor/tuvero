import MatrixModel from './matrixmodel.js';

/**
 * Constructor
 *
 * @param size
 *          size of the matrix. defaults to 0
 */
class SymmetricMatrixModel extends MatrixModel {
  constructor(size) {
    super(size);
  }

  /**
   * get() function, which maps super-diagonal elements to a lower triangular
   * matrix
   *
   * @param row
   *          row
   * @param col
   *          column
   * @return the stored value
   */
  get(row, col) {
    if (row < col) {
      return super.get(col, row);
    }
    return super.get(row, col);
  }

  /**
   * set() function, which maps super-diagonal writes to the lower triangular
   * matrix
   *
   * @param row
   *          row
   * @param col
   *          column
   * @param value
   *          value
   * @return this on success, undefined otherwise
   */
  set(row, col, value) {
    if (row < col) {
      return super.set(col, row, value);
    }
    return super.set(row, col, value);
  }
}

export default SymmetricMatrixModel;