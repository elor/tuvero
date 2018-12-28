/**
 * SymmetricMatrixModel is a MatrixModel subclass which maps write and read
 * access to a triangular portion of the matrix, thereby maintaining symmetry.
 *
 * The restrictions are imposed by overloading the get() and set() functions,
 * which in turn call the superclass functions if the range is within the
 * writable limits.
 *
 * @return SymmetricMatrixModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'math/matrixmodel'], function (extend, MatrixModel) {
  /**
   * Constructor
   *
   * @param size
   *          size of the matrix. defaults to 0
   */
  function SymmetricMatrixModel (size) {
    SymmetricMatrixModel.superconstructor.call(this, size)
  }
  extend(SymmetricMatrixModel, MatrixModel)

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
  SymmetricMatrixModel.prototype.get = function (row, col) {
    if (row < col) {
      return SymmetricMatrixModel.superclass.get.call(this, col, row)
    }

    return SymmetricMatrixModel.superclass.get.call(this, row, col)
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
  SymmetricMatrixModel.prototype.set = function (row, col, value) {
    if (row < col) {
      return SymmetricMatrixModel.superclass.set.call(this, col, row, value)
    }

    return SymmetricMatrixModel.superclass.set.call(this, row, col, value)
  }

  return SymmetricMatrixModel
})
