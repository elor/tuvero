/**
 * DelegateMatrix takes a MatrixModel instance (or any of its subclasses) and
 * wraps around it as a MatrixModel instance, enabling all matrix read functions
 * while write functions are disabled.
 *
 * By overriding get(), the return values can be modified (absolute, only
 * positive, checkered patterns, whatever). Use this.superget() to access the
 * original get()
 *
 * @return DelegateMatrix
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matrixmodel'], function(extend, MatrixModel) {
  /**
   * Constructor
   */
  function DelegateMatrix(matrix) {
    // call constructor for safety. We're going to overwrite all fields
    DelegateMatrix.superconstructor.call(this, matrix.length);

    if (!matrix) {
      throw new Error('DelegateMatrix(): no input matrix: ' + matrix);
    }

    this.data = matrix.data;
    this.superget = matrix.get;
    /* this.length is set by the superconstructor */

    matrix.registerListener(this);
  }
  extend(DelegateMatrix, MatrixModel);

  /**
   * Delegate the get call to superget, with the appropriate adjustments.
   *
   * Please override ONLY this function
   *
   * @param row
   *          the row
   * @param col
   *          the column
   * @return
   */
  DelegateMatrix.prototype.get = function(row, col) {
    return this.superget(row, col);
  };

  /**
   * Disable write function
   */
  DelegateMatrix.prototype.remove = undefined;

  /**
   * Disable write function
   */
  DelegateMatrix.prototype.set = undefined;

  /**
   * Disable write function
   */
  DelegateMatrix.prototype.fill = undefined;

  /**
   * Disable write function
   */
  DelegateMatrix.prototype.resize = undefined;

  /**
   * automatically update the length when the references matrix is resized and
   * re-emit the event
   *
   * @param matrix
   *          the emitter, i.e. the base matrix
   */
  DelegateMatrix.prototype.onresize = function(matrix) {
    this.length = matrix.length;
    this.emit('resize');
  };

  return DelegateMatrix;
});
