import DelegateMatrix from './delegatematrix.js'

/**
 * Constructor
 *
 * @param matrix
 *          the matrix to bind itself to
 */
class TransposeSumMatrix extends DelegateMatrix {
  /**
   * return only positive values
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return get(row, col)+get(col, row), i.e. (A + A^T)
   */
  get (row, col) {
    const v1 = this.superget(row, col)
    const v2 = this.superget(col, row)
    if (v1 === undefined || v2 === undefined) {
      return undefined
    }
    return v1 + v2
  }
}

export default TransposeSumMatrix
