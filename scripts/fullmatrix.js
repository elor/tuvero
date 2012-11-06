/**
 * FullMatrix: Square matrix implementation according to Matrix.Interface Empty
 * entries are specified as undefined array values
 * 
 * @param size
 *          {Integer} size of the matrix. defaults to 0
 * @returns {FullMatrix} this
 */
define(function() {
  function FullMatrix(size) {
    this.size = size || 0;
    this.array = [];

    return this;
  }

  /**
   * Restores a blank state of the FullMatrix
   * 
   * @returns {FullMatrix} this
   */
  FullMatrix.prototype.clear = function(size) {
    this.array = [];
    this.size = size || 0;

    return this;
  };

  /**
   * copies the matrix. Optimizations in term of memory are attempted
   * 
   * @returns {FullMatrix} the copy
   */
  FullMatrix.prototype.clone = function() {
    var size = this.size;
    var retval = new FullMatrix(size);
    var a = this.array;
    var b = retval.array;

    // loop over the rows, skipping empty rows
    // loop over every col within the rows and copy only non-null values
    // create row-arrays (first index of b) as needed
    for ( var i = 0; i < size; ++i) {
      if (a[i]) {
        for ( var j = 0; j < size; ++j) {
          if (a[i][j]) {
            if (!b[i]) {
              b[i] = [];
            }
            b[i][j] = a[i][j];
          }
        }
      }
    }

    return retval;
  };

  /**
   * erases the rows and cols associated with the index from the matrix
   * 
   * @param index
   *          {Integer} index
   * @returns {FullMatrix} this
   */
  FullMatrix.prototype.erase = function(index) {
    if (index >= this.size || index < 0) {
      return this;
    }

    var a = this.array;
    var size = a.length;
    a.splice(index, 1);
    for ( var i = 0; i < size; ++i) {
      if (a[i]) {
        a[i].splice(index, 1);
      }
    }

    this.size -= 1;

    return this;
  };

  /**
   * simply increases this.size. array expansions occur in the set function
   * 
   * @param by
   *          integer amount by which to extend the array. defaults to 1
   * @returns {FullMatrix} this
   */
  FullMatrix.prototype.extend = function(by) {
    if (by <= 0) {
      return this;
    }
    by = by || 1;
    this.size += by;

    return this;
  };

  /**
   * retrieves the value from the given indices.
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @returns value at (row, col). defaults to 0
   */
  FullMatrix.prototype.get = function(row, col) {
    if (this.array[row] === undefined) {
      return 0;
    }

    return this.array[row][col] || 0;
  };

  /**
   * sets the value at the given indices and allocates/frees the field if
   * necessary
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @param value
   *          integer value to store in position (row, col)
   * @returns {FullMatrix} this
   */
  FullMatrix.prototype.set = function(row, col, value) {
    var rowref = this.array[row];

    if (value) {
      if (rowref === undefined) {
        rowref = this.array[row] = [];
      }
      rowref[col] = value;
    } else if (rowref) {
      delete rowref[col];
    }

    return this;
  };
  return FullMatrix;
});
