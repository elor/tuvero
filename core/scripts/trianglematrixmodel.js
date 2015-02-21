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
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matrixmodel'], function(extend, MatrixModel) {
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

  TriangleMatrixModel.prototype.get = function(row, col) {
    if (row < col) {
      return 0;
    } else {
      return TriangleMatrixModel.superclass.get.call(this, row, col);
    }
  };

  TriangleMatrixModel.prototype.set = function(row, col, value) {
    if (row < col) {
      return undefined;
    } else {
      return TriangleMatrixModel.superclass.set.call(this, row, col, value);
    }
  };

  return TriangleMatrixModel;
});
