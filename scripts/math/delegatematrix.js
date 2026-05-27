import MatrixModel from './matrixmodel.js'

/**
 * Constructor
 *
 * @param matrix
 *          the matrix to bind itself to
 */
class DelegateMatrix extends MatrixModel {
  constructor (matrix) {
    // call constructor for safety. We're going to overwrite all fields
    super(matrix.length)
    if (!matrix) {
      throw new Error('DelegateMatrix(): no input matrix: ' + matrix)
    }
    this.data = matrix.data
    this.superget = matrix.get
    /* this.length is set by the superconstructor */

    matrix.registerListener(this)
  }

  /**
   * Delegate the get call to superget, with the appropriate adjustments.
   *
   * Please override ONLY this function
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return the value at the given matrix position
   */
  get (row, col) {
    return this.superget(row, col)
  }

  /**
   * automatically update the length when the references matrix is resized and
   * re-emit the event
   *
   * @param matrix
   *          the emitter, i.e. the base matrix
   */
  onresize (matrix) {
    this.length = matrix.length
    this.emit('resize')
  }
}

/**
 * Disable write function
 */
DelegateMatrix.prototype.remove = undefined

/**
 * Disable write function
 */
DelegateMatrix.prototype.set = undefined

/**
 * Disable write function
 */
DelegateMatrix.prototype.fill = undefined

/**
 * Disable write function
 */
DelegateMatrix.prototype.resize = undefined

export default DelegateMatrix
