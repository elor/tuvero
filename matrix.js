/**
 * This file contains the following variables/classes:
 * Matrix - static object with common matrix operations and matrix interface
 * FullMatrix - sparse matrix
 * MirrorMatrix - sparse mirrored matrix   
 */

/**
 * Matrix variable contains functions and interfaces for matrix/vector
 * operations.
 */
var Matrix = {
  /**
   * Square Matrix interface with default size 0. behavior for out-of-bounds
   * indices and wrong types is undefined.
   */
  Interface : {
    size : 0, // indicator of the current size of the matrix in both dimensions

    clear : function() {
      // reset the Matrix to a blank state with default size
      // implementations in the form of clear(newsize) are encouraged
      return this;
    },
    clone : function() {
      // create a deep copy of the matrix
      return copy;
    },
    erase : function(index) {
      // erase an index (cols and rows) from the matrix
      return this;
    },
    extend : function(by) {
      // safely extend the size of the matrix by "by" with 1 as a default value
      // behaviour with negative "by" value is undefined
      return this;
    },
    get : function(row, col) {
      // retrieve the value stored at (row, col)
      return 0;
    },
    set : function(row, col, value) {
      // store value at (row, col)
      return this;
    },
  },

  /**
   * EqualSize performs an equality test of the sizes of both matrices
   * 
   * @param A
   *          {Matrix} first matrix
   * @param B
   *          {Matrix} second matrix
   * @returns {Boolean} true if sizes are equal, false otherwise
   */
  EqualSize : function(A, B) {
    return A.size === B.size && A.size !== undefined;
  },

  /**
   * copies the specified row of the matrix to a populated vector
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param row
   *          {Integer} row number
   * @returns {Array} populated vector representing the row
   */
  GetRow : function(matrix, row) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = matrix.get(row, i);
    }

    return vector;
  },

  /**
   * copies the specified col of the matrix to a populated vector
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param col
   *          {Integer} col number
   * @returns {Array} populated vector representing the row
   */
  GetCol : function(matrix, col) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = matrix.get(i, col);
    }

    return vector;
  },

  /**
   * calculates and returns the row sum
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param row
   *          {Integer} row number
   * @returns {Number} the row sum
   */
  RowSum : function(matrix, row) {
    var sum = 0;
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      sum += matrix.get(row, i);
    }

    return sum;
  },

  /**
   * Calculates all row sums
   * 
   * @param matrix
   *          {Matrix} matrix
   * @returns {Array} vector of row sums
   */
  RowSums : function(matrix) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = this.RowSum(matrix, i);
    }

    return vector;
  },

  /**
   * Matrix Multiplication. All arguments are required to implement the Matrix
   * interface.
   * 
   * @param A
   *          first operand
   * @param B
   *          second operand
   * @param C
   *          return reference
   * @returns C
   */
  Mult : function(A, B, C) {
    if (C.size !== 0) {
      C.clear();
    }
    if (!this.EqualSize(A, B)) {
      // console.error("Matrix.Mult: wrong sizes: ", A.size, " != ", B.size);
      return undefined;
    }

    var size = A.size;
    var val;
    C.extend(size);

    for ( var row = 0; row < size; ++row) {
      for ( var col = 0; col < size; ++col) {
        val = 0;
        for ( var i = 0; i < size; ++i) {
          val += A.get(row, i) * B.get(i, col);
        }
        C.set(row, col, val);
      }
    }

    return C;
  },

  /**
   * Matrix-Vector multiplication. vector is automatically extended or shrinked
   * to the size of the matrix.
   * 
   * @param matrix
   *          {Matrix} matrix operand
   * @param vector
   *          {Array} vector operand
   * @returns {Array} resulting vector, which is fully populated with integer
   *          values
   */
  MultVec : function(matrix, vector) {
    var retvec = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      retvec[i] = 0;
      for ( var j = 0; j < size; ++j) {
        retvec[i] += matrix.get(i, j) * (vector[j] || 0);
      }
    }

    return retvec;
  },

  /**
   * calculates and returns the col sum
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param col
   *          {Integer} col number
   * @returns {Number} the col sum
   */
  ColSum : function(matrix, col) {
    var sum = 0;
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      sum += matrix.get(i, col);
    }

    return sum;
  },

  /**
   * Calculates all col sums
   * 
   * @param matrix
   *          {Matrix} matrix
   * @returns {Array} vector of col sums
   */
  ColSums : function(matrix) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = this.ColSum(matrix, i);
    }

    return vector;
  },

  /**
   * Transpose the matrix in place
   * 
   * @param matrix
   *          {Matrix} matrix to transpose
   * @returns {Matrix} a reference to matrix
   */
  Transpose : function(matrix) {
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      for ( var j = 0; j < i; ++j) {
        tmp = matrix.get(i, j);
        matrix.set(i, j, matrix.get(j, i));
        matrix.set(j, i, tmp);
      }
    }

    return matrix;
  },

  /**
   * Vector-Matrix multiplication. vector is automatically extended or shrinked
   * to the size of the matrix.
   * 
   * @param vector
   *          {Array} vector operand
   * @param matrix
   *          {Matrix} matrix operand
   * @returns {Array} resulting vector, which is fully populated with integer
   *          values
   */
  VecMult : function(vector, matrix) {
    var retvec = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      retvec[i] = 0;
      for ( var j = 0; j < size; ++j) {
        retvec[i] += (vector[j] || 0) * matrix.get(j, i);
      }
    }

    return retvec;
  },
};

/**
 * FullMatrix: Square matrix implementation according to Matrix.Interface Empty
 * entries are specified as undefined array values
 * 
 * @param size
 *          {Integer} size of the matrix. defaults to 0
 * @returns {FullMatrix} this
 */
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

/**
 * HalfMatrix: Half square matrix implementation according to Matrix.Interface.
 * Empty entries are referenced as undefined array values. All values above the
 * main diagonal aren't stored at all. See get/set for details. The
 * implementation may use more arrays than necessary, but they are expected to
 * be populated to a reasonable degree
 * 
 * @param size
 *          {Integer} size of the matrix
 * @param type
 *          {Integer} an integer identifying the type of the half matrix: -1:
 *          negated, 0: empty, 1: mirrored
 * @returns {HalfMatrix} this
 */
function HalfMatrix(type, size) {
  type = type || 0;
  switch (type) {
  case HalfMatrix.empty:
    // already defaulting to prototype.get:
    // this.get = this.get;
    break;
  case HalfMatrix.mirrored:
    this.get = this.getMirrored;
    break;
  case HalfMatrix.negated:
    this.get = this.getNegated;
    break;
  default:
    break;
  }
  this.size = size || 0;
  this.array = [];

  return this;
}

// What to do with values above the main diagonal:
HalfMatrix.empty = 0; // return 0
HalfMatrix.mirrored = 1; // return the mirrored value
HalfMatrix.negated = -1; // return the negative mirrored value

/**
 * Restores a blank state of the HalfMatrix
 * 
 * @returns {HalfMatrix} this
 */
HalfMatrix.prototype.clear = function(size) {
  this.array = [];
  this.size = size || 0;

  return this;
};

/**
 * copies the matrix. Optimizations in term of memory are attempted
 * 
 * @returns {HalfMatrix} the copy
 */
HalfMatrix.prototype.clone = function() {
  var size = this.size;
  var type;

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

  var retval = new HalfMatrix(type, size);
  var a = this.array;
  var b = retval.array;

  // loop over the rows, skipping empty rows
  // loop over every col within the rows and copy only non-null values
  // create row-arrays (first index of b) as needed
  for ( var i = 0; i < size; ++i) {
    if (a[i]) {
      for ( var j = 0; j <= i; ++j) {
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
HalfMatrix.prototype.erase = function(index) {
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
 * @returns {HalfMatrix} this
 */
HalfMatrix.prototype.extend = function(by) {
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
HalfMatrix.prototype.get = function(row, col) {
  if (col > row) {
    return 0;
  }
  if (this.array[row] === undefined) {
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
HalfMatrix.prototype.getMirrored = function(row, col) {
  if (col > row) {
    return this.get(col, row);
  }
  if (this.array[row] === undefined) {
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
HalfMatrix.prototype.getNegated = function(row, col) {
  if (col > row) {
    return -this.get(col, row);
  }
  if (this.array[row] === undefined) {
    return 0;
  }

  return this.array[row][col] || 0;
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
HalfMatrix.prototype.set = function(row, col, value) {
  if (col > row) {
    return this;
  }

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
