define([ './rleblobber' ], function (RLEBlobber) {
  /**
   * HalfMatrix: Half square matrix implementation according to
   * Matrix.Interface. Empty entries are referenced as undefined array values.
   * All values above the main diagonal aren't stored at all. See get/set for
   * details. The implementation may use more arrays than necessary, but they
   * are expected to be populated to a reasonable degree
   * 
   * @param size
   *          {Integer} size of the matrix
   * @param type
   *          {Integer} an integer identifying the type of the half matrix: -1:
   *          negated, 0: empty, 1: mirrored
   * @returns {HalfMatrix} this
   */
  var HalfMatrix = function (type, size) {
    type = type || 0;

    this.setType(type);

    this.size = size || 0;
    this.array = [];

    return this;
  };

  // What to do with values above the main diagonal:
  HalfMatrix.empty = 0; // return 0
  HalfMatrix.mirrored = 1; // return the mirrored value
  HalfMatrix.negated = -1; // return the negative mirrored value

  /**
   * sets a type
   * 
   * @param type
   *          type id (HalfMatrix.empty/mirrored/negated)
   * @returns this on success, undefined otherwise
   */
  HalfMatrix.prototype.setType = function (type) {
    switch (type) {
    case HalfMatrix.empty:
      this.get = this.getEmpty;
      this.set = this.setEmpty;
      break;
    case HalfMatrix.mirrored:
      this.get = this.getMirrored;
      this.set = this.setMirrored;
      break;
    case HalfMatrix.negated:
      this.get = this.getNegated;
      this.set = this.setNegated;
      break;
    default:
      return undefined;
    }

    this.type = type;

    return this;
  };

  /**
   * Restores a blank state of the HalfMatrix
   * 
   * @returns {HalfMatrix} this
   */
  HalfMatrix.prototype.clear = function (size) {
    this.array = [];
    this.size = size || 0;

    return this;
  };

  /**
   * copies the matrix. Optimizations in term of memory are attempted
   * 
   * @returns {HalfMatrix} the copy
   */
  HalfMatrix.prototype.clone = function () {
    var size, type, retval, a, b, i, j;

    switch (this.get) {
    case HalfMatrix.prototype.getMirrored:
      type = 1;
      break;
    case HalfMatrix.prototype.getNegated:
      type = -1;
      break;
    default:
      type = 0;
      break;
    }

    size = this.size;
    retval = new HalfMatrix(type, size);
    a = this.array;
    b = retval.array;

    // loop over the rows, skipping empty rows
    // loop over every col within the rows and copy only non-null values
    // create row-arrays (first index of b) as needed
    for (i = 0; i < size; i += 1) {
      if (a[i]) {
        for (j = 0; j <= i; j += 1) {
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
   * @returns {HalfMatrix} this
   */
  HalfMatrix.prototype.erase = function (index) {
    var size, a, i;

    if (index >= this.size || index < 0) {
      return this;
    }

    a = this.array;
    size = a.length;

    a.splice(index, 1);
    for (i = 0; i < size; i += 1) {
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
   * @returns {HalfMatrix} this
   */
  HalfMatrix.prototype.extend = function (by) {
    if (by <= 0) {
      return this;
    }
    by = by || 1;
    this.size += by;

    return this;
  };

  /**
   * retrieves the value from the given indices using the empty type
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @returns value at (row, col). defaults to 0
   */
  HalfMatrix.prototype.getEmpty = function (row, col) {
    if (col > row) {
      return 0;
    }
    if (!this.array[row]) {
      return 0;
    }

    return this.array[row][col] || 0;
  };

  /**
   * retrieves the value from the given indices using the mirrored type
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @returns value at (row, col). defaults to 0
   */
  HalfMatrix.prototype.getMirrored = function (row, col) {
    if (col > row) {
      return this.get(col, row);
    }

    if (!this.array[row]) {
      return 0;
    }

    return this.array[row][col] || 0;
  };

  /**
   * retrieves the value from the given indices using the negated type
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @returns value at (row, col). defaults to 0
   */
  HalfMatrix.prototype.getNegated = function (row, col) {
    if (col > row) {
      return -this.get(col, row);
    }

    if (!this.array[row]) {
      return 0;
    }

    return this.array[row][col] || 0;
  };

  /**
   * set() function for mirrored half matrices
   * 
   * @param row
   *          row
   * @param col
   *          column
   * @param value
   *          value
   * @returns this
   */
  HalfMatrix.prototype.setMirrored = function (row, col, value) {
    if (col > row) {
      return this.set(col, row, value);
    }
    return this.setEmpty(row, col, value);
  };

  /**
   * set() function for 'negated' half matrices
   * 
   * @param row
   *          row
   * @param col
   *          column
   * @param value
   *          value
   * @returns this
   */
  HalfMatrix.prototype.setNegated = function (row, col, value) {
    if (col > row) {
      return this.set(col, row, -value);
    }
    return this.setEmpty(row, col, value);
  };

  /**
   * sets the value at the given indices and allocates/frees the field if
   * necessary. Values below the main diagonal are ignored.
   * 
   * @param row
   *          vertical position
   * @param col
   *          horizontal position
   * @param value
   *          integer value to store in position (row, col)
   * @returns {HalfMatrix} this
   */
  HalfMatrix.prototype.setEmpty = function (row, col, value) {
    var rowref;

    if (col > row) {
      return this;
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

  /**
   * store content in a convenient blob
   * 
   * @returns
   */
  HalfMatrix.prototype.toBlob = function () {
    var ob;

    ob = {
      type : this.type,
      size : this.size,
      array : RLEBlobber.toBlob(this.array)
    };

    return JSON.stringify(ob);
  };

  HalfMatrix.prototype.fromBlob = function (blob) {
    var ob;

    ob = JSON.parse(blob);

    this.size = ob.size;
    this.array = RLEBlobber.fromBlob(ob.array);

    this.setType(ob.type);
  };

  return HalfMatrix;
});
