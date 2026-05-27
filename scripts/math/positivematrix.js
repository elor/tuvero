import DelegateMatrix from './delegatematrix.js'

/**
 * Constructor
 * @param matrix the matrix to bind itself to
 */
class PositiveMatrix extends DelegateMatrix {
  constructor (matrix) {
    super(matrix)
  }

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
  get (row, col) {
    const value = this.superget(row, col)
    if (value < 0) {
      return 0
    }
    return value
  }
}

export default PositiveMatrix
