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
   * Square Matrix interface with size 0 and Behaviour for out-of-bounds indices
   * and wrong types is undefined
   */
  Interface : {
    size : 0,
    extend : function(by) {
      // safely extend the size of the matrix by "by" with 1 as a default value
      // behaviour with negative "by" value is undefined
      return this;
    },
    get : function(line, row) {
      return 0;
    },
    clear : function() {
      return this;
    },
    set : function(line, row, value) {
      return this;
    }
  },
  
  Transpose : function(dst, src) {
    var size = src.size;
    
    dst.clear(size);
    
    for (var i = 0; i < size; ++i) {
      for (var j = 0; j < size; ++j)
      dst.set(i, j, src.get(j, i));
    }
    
    return dst;
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
//      console.error("Matrix.Mult: wrong sizes: ", A.size, " != ", B.size);
      return undefined;
    }

    var size = A.size;
    var val;
    C.extend(size);

    for ( var line = 0; line < size; ++line) {
      for ( var row = 0; row < size; ++row) {
        val = 0;
        for ( var i = 0; i < size; ++i) {
          val += A.get(line, i) * B.get(i, row);
        }
        C.set(line, row, val);
      }
    }

    return C;
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
   * copies the specified line of the matrix to a populated vector
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param line
   *          {Integer} line number
   * @returns {Array} populated vector representing the line
   */
  GetLine : function(matrix, line) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = matrix.get(line, i);
    }

    return vector;
  },

  /**
   * copies the specified row of the matrix to a populated vector
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param row
   *          {Integer} row number
   * @returns {Array} populated vector representing the line
   */
  GetRow : function(matrix, row) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = matrix.get(i, row);
    }

    return vector;
  },

  /**
   * calculates and returns the line sum
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param line
   *          {Integer} line number
   * @returns {Number} the line sum
   */
  LineSum : function(matrix, line) {
    var sum = 0;
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      sum += matrix.get(line, i);
    }

    return sum;
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
      sum += matrix.get(i, row);
    }

    return sum;
  },

  /**
   * Calculates all line sums
   * 
   * @param matrix
   *          {Matrix} matrix
   * @returns {Array} vector of line sums
   */
  LineSums : function(matrix) {
    var vector = [];
    var size = matrix.size;

    for ( var i = 0; i < size; ++i) {
      vector[i] = this.LineSum(matrix, i);
    }

    return vector;
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
  }
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
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @returns value at (line, row). defaults to 0
 */
FullMatrix.prototype.get = function(line, row) {
  if (this.array[line] === undefined) {
    return 0;
  }

  return this.array[line][row] || 0;
};

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
 * sets the value at the given indices and allocates/frees the field if
 * necessary
 * 
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @param value
 *          integer value to store in position (line, row)
 * @returns {FullMatrix} this
 */
FullMatrix.prototype.set = function(line, row, value) {
  var lineref = this.array[line];

  if (value) {
    if (lineref === undefined) {
      lineref = this.array[line] = [];
    }
    lineref[row] = value;
  } else if (lineref) {
    delete lineref[row];
  }

  return this;
};

/**
 * HalfMatrix: Half square matrix implementation according to Matrix.Interface.
 * Empty entries are referenced as undefined array values. All values above the
 * main diagonal aren't stored at all. See get/set for details.
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
    console.error("HalfMatrix: wrong type: ", type);
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
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @returns value at (line, row). defaults to 0
 */
HalfMatrix.prototype.get = function(line, row) {
  if (line > row) {
    return 0;
  }
  if (this.array[line] === undefined) {
    return 0;
  }

  return this.array[line][row] || 0;
};

/**
 * retrieves the value from the given indices using the mirrored type
 * 
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @returns value at (line, row). defaults to 0
 */
HalfMatrix.prototype.getMirrored = function(line, row) {
  if (line > row) {
    return this.get(row, line);
  }
  if (this.array[line] === undefined) {
    return 0;
  }

  return this.array[line][row] || 0;
};

/**
 * retrieves the value from the given indices using the negated type
 * 
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @returns value at (line, row). defaults to 0
 */
HalfMatrix.prototype.getNegated = function(line, row) {
  if (line > row) {
    return -this.get(row, line);
  }
  if (this.array[line] === undefined) {
    return 0;
  }

  return this.array[line][row] || 0;
};

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
 * sets the value at the given indices and allocates/frees the field if
 * necessary. Values below the main diagonal are ignored.
 * 
 * @param line
 *          vertical position
 * @param row
 *          horizontal position
 * @param value
 *          integer value to store in position (line, row)
 * @returns {HalfMatrix} this
 */
HalfMatrix.prototype.set = function(line, row, value) {
  if (line > row) {
    return this;
  }

  var lineref = this.array[line];

  if (value) {
    if (lineref === undefined) {
      lineref = this.array[line] = [];
    }
    lineref[row] = value;
  } else if (lineref) {
    delete lineref[row];
  }

  return this;
};
