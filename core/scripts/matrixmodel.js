/**
 * MatrixModel, a square matrix representation.
 *
 * We don't inherit from ListModel or VectorModel since they're compact
 * representations, but this class is supposed to handle extremely sparse
 * matrices. So, we're defining and maintaining our own arrays.
 *
 * TODO emit events, e.g. for auto-resizing of dependent classes
 *
 * @return MatrixModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model'], function(extend, Model) {
  /**
   * Constructor
   *
   * @param size
   *          size of the matrix. defaults to 0
   */
  function MatrixModel(size) {
    MatrixModel.superconstructor.call(this);

    this.data = [];
    this.length = 0;
    this.resize(size || 0);

    return this;
  }
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

    this.data.splice(index, 1);
    this.data.forEach(function(b) {
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
    if (!this.data[row]) {
      return 0;
    }

    return this.data[row][col] || 0;
  };

  /**
   * retrieves the absolute value from the given indices.
   *
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @return abs(get(row, col))
   */
  MatrixModel.prototype.getAbs = function(row, col) {
    var value;

    value = this.get(row, col);
    if (value < 0) {
      return -value;
    }
    return value;
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

    rowref = this.data[row];

    if (value) {
      if (!rowref) {
        rowref = this.data[row] = [];
      }
      rowref[col] = value;
    } else if (rowref) {
      delete rowref[col];
    }

    return this;
  };

  /**
   * write the main diagonal elements to a vector
   *
   * @param vector
   *          a VectorModel instance to write the results to
   * @return vector on success, undefined otherwise
   */
  MatrixModel.prototype.diagonal = function(vector) {
    var index;

    vector.resize(this.length);

    for (index = 0; index < vector.length; index += 1) {
      vector.set(index, this.get(index, index));
    }

    return vector;
  };

  /**
   * perform a Matrix*Vector multiplication and store the results in the
   * provided output vector
   *
   * @param outVec
   *          the output vector
   * @param vec
   *          the input vector
   * @return outVec on success, containing this*vec. undefined otherwise.
   */
  MatrixModel.prototype.multVector = function(outVec, vec) {
    var row, col, sum;

    if (vec.length !== this.length) {
      console.warn('MatrixModel.multVector: different input lengths: '
          + this.length + '<>' + vec.length);
      return undefined;
    }

    outVec.resize(vec.length);

    for (row = 0; row < outVec.length; row += 1) {
      sum = 0;

      for (col = 0; col < outVec.length; col += 1) {
        sum += this.get(row, col) * vec.get(col);
      }

      outVec.set(row, sum);
    }

    return outVec;
  };

  /**
   * perform a Vector*Matrix multiplication and store the results in the
   * provided output vector
   *
   * @param outVec
   *          the output vector
   * @param vec
   *          the input vector
   * @return outVec on success, containing this*vec. undefined otherwise.
   */
  MatrixModel.prototype.vectorMult = function(outVec, vec) {
    var row, col, sum;

    if (vec.length !== this.length) {
      console.warn('MatrixModel.multVector: different input lengths: '
          + this.length + '<>' + vec.length);
      return undefined;
    }

    outVec.resize(vec.length);

    for (col = 0; col < outVec.length; col += 1) {
      sum = 0;

      for (row = 0; row < outVec.length; row += 1) {
        sum += this.get(row, col) * vec.get(row);
      }

      outVec.set(col, sum);
    }

    return outVec;
  };

  /**
   * set all elements in the matrix to the same value.
   *
   * In AntisymmetricMatrixModel, the superdiagonal elements will be inverted,
   * while the diagonal elements will equal the value.
   *
   * @param value
   *          Optional. The value. Defaults to 0.
   */
  MatrixModel.prototype.fill = function(value) {
    var row, col;
    value = value || 0;

    if (value === 0) {
      // discard all data, since get() defaults to 0.
      this.data.splice(0);
    } else {
      /*
       * Since we don't know about the data mapping, we cannot simply copy data
       * across this.data. Instead, we just iterate over this.set().
       */
      for (row = 0; row < this.length; row += 1) {
        for (col = 0; col < this.length; col += 1) {
          this.set(row, col, value);
        }
      }
    }
  };

  return MatrixModel;
});
