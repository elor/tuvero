/**
 * AntisymmetricMatrixModel is a MatrixModel subclass which maps write and read
 * access to a triangular portion of the matrix, thereby maintaining
 * antisymmetry. For this, the values themselves are also negated.
 *
 * Other than a pure antisymmetric matrix, non-zero writes to the main diagonal
 * are allowed and are not negated. They can be useful in some cases. If you
 * require a strictly antisymmetric matrix, just don't write there.
 *
 * The restrictions are imposed by overloading the get() and set() functions,
 * which in turn call the superclass functions if the range is within the
 * writable limits.
 *
 * @return AntisymmetricMatrixModel
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
  function AntisymmetricMatrixModel(size) {
    AntisymmetricMatrixModel.superconstructor.call(this, size);
  }
  extend(AntisymmetricMatrixModel, MatrixModel);

  /**
   * get() function, which maps super-diagonal elements to a lower triangular
   * matrix, including the necessary additive inversion
   *
   * @param row
   *          row
   * @param col
   *          column
   * @return the stored value
   */
  AntisymmetricMatrixModel.prototype.get = function(row, col) {
    if (row < col) {
      return -AntisymmetricMatrixModel.superclass.get.call(this, col, row);
    }

    return AntisymmetricMatrixModel.superclass.get.call(this, row, col);
  };

  /**
   * set() function, which maps super-diagonal writes to the lower triangular
   * matrix, with an additive inversion
   *
   * @param row
   *          row
   * @param col
   *          column
   * @param value
   *          value
   * @return this on success, undefined otherwise
   */
  AntisymmetricMatrixModel.prototype.set = function(row, col, value) {
    if (row < col) {
      return AntisymmetricMatrixModel.superclass.set.call(this, col, row,
          -value);
    }

    return AntisymmetricMatrixModel.superclass.set.call(this, row, col, value);
  };

  return AntisymmetricMatrixModel;
});
