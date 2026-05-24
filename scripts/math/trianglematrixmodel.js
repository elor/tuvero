import MatrixModel from './matrixmodel.js';

/**
 * Constructor
 *
 * @param size
 *          size of the matrix. defaults to 0
 */
class TriangleMatrixModel extends MatrixModel {
  constructor(size) {
    super(size);
  }

  /**
   * get() function, which ignores super-diagonal elements
   *
   * @param row
   *          row
   * @param col
   *          column
   * @return 0 if reading a super-diagonal element, the stored value otherwise
   */
  get(row, col) {
    if (row < col) {
      return 0;
    }
    return super.get(row, col);
  }

  /**
   * set() function, which ignores super-diagonal positions
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
      return undefined;
    }
    return super.set(row, col, value);
  }
}

export default TriangleMatrixModel;