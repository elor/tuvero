/**
 * MatrixModel, a square matrix representation.
 *
 * We don't inherit from ListModel or VectorModel since they're compact
 * representations, but this class is supposed to handle extremely sparse
 * matrices. So, we're defining and maintaining our own arrays.
 *
 * @return MatrixModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model'], function(extend, Model) {
  /**
   * Constructor
   */
  /**
   * Constructor
   *
   * @param size
   *          {Integer} size of the matrix. defaults to 0
   * @return {MatrixModel} this
   */
  var MatrixModel = function(size) {
    MatrixModel.superconstructor.call(this);

    this.array = [];
    this.length = 0;
    this.resize(size || 0);

    return this;
  };
  extend(MatrixModel, Model);

  /**
   * removes the rows and cols associated with the index from the matrix
   *
   * @param index
   *          {Integer} index
   * @return {MatrixModel} this
   */
  MatrixModel.prototype.remove = function(index) {
    if (index >= this.length || index < 0) {
      return this;
    }

    this.array.splice(index, 1);
    this.array.forEach(function(b) {
      b.splice(index, 1);
    });

    this.length -= 1;

    return this;
  };

  /**
   * resizes the matrix while taking care of
   *
   * @param by
   *          integer amount by which to extend the array. defaults to 1
   * @return {MatrixModel} this
   */
  MatrixModel.prototype.resize = function(size) {
    if (size === undefined) {
      return undefined;
    }
    if (size < 0) {
      size = 0;
    }

    while (this.length > size) {
      this.remove(this.length - 1);
    }
    if (this.length < size) {
      this.length = size;
    }

    return this;
  };

  /**
   * retrieves the value from the given indices.
   *
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @return value at (row, col). Defaults to 0
   */
  MatrixModel.prototype.get = function(row, col) {
    if (Math.min(row, col) < 0 || Math.max(row, col) >= this.length) {
      console.warn('MatrixModel.get(): out of bounds');
      return undefined;
    }
    if (!this.array[row]) {
      return 0;
    }

    return this.array[row][col] || 0;
  };

  /**
   * sets the value at the given indices and allocates/frees the cell/row if
   * possible
   *
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @param value
   *          integer value to store in position (row, col)
   * @return {MatrixModel} this
   */
  MatrixModel.prototype.set = function(row, col, value) {
    var rowref;

    if (Math.min(row, col) < 0 || Math.max(row, col) >= this.length) {
      console.warn('MatrixModel.set(): out of bounds');
      return undefined;
    }

    rowref = this.array[row];

    if (value) {
      if (!rowref) {
        rowref = this.array[row] = [];
      }
      rowref[col] = value;
    } else if (rowref) {
      delete rowref[col];
    }

    return this;
  };

  return MatrixModel;
});
