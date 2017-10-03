/**
 * TriangleMatrixModel is a MatrixModel subclass which restricts write access to
 * the main diagonal and sub-diagonal elements, yielding a lower triangular
 * matrix class.
 *
 * The restrictions are imposed by overloading the get() and set() functions,
 * which in turn call the superclass functions if the range is within the
 * writable limits
 *
 *
 * @return TriangleMatrixModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'math/matrixmodel'], function(extend, MatrixModel) {
  /**
   * Constructor
   *
   * @param size
   *          size of the matrix. defaults to 0
   */
  function TriangleMatrixModel(size) {
    TriangleMatrixModel.superconstructor.call(this, size);
  }
  extend(TriangleMatrixModel, MatrixModel);

  /**
   * get() function, which ignores super-diagonal elements
   *
   * @param row
   *          row
   * @param col
   *          column
   * @return 0 if reading a super-diagonal element, the stored value otherwise
   */
  TriangleMatrixModel.prototype.get = function(row, col) {
    if (row < col) {
      return 0;
    }

    return TriangleMatrixModel.superclass.get.call(this, row, col);
  };

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
  TriangleMatrixModel.prototype.set = function(row, col, value) {
    if (row < col) {
      return undefined;
    }

    return TriangleMatrixModel.superclass.set.call(this, row, col, value);
  };

  return TriangleMatrixModel;
});
