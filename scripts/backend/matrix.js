/**
 * Matrix variable contains functions and interfaces for matrix/vector
 * operations.
 */
define({
  /**
   * Square Matrix interface with default size 0. behavior for out-of-bounds
   * indices and wrong types is undefined.
   */
  Interface : {
    size : 0, // indicator of the current size of the matrix in both dimensions

    clear : function () {
      // reset the Matrix to a blank state with default size
      // implementations in the form of clear(newsize) are encouraged
      return this;
    },
    clone : function () {
      var copy = null;
      // create a deep copy of the matrix
      return copy;
    },
    erase : function (index) {
      // erase an index (cols and rows) from the matrix
      return this;
    },
    extend : function (by) {
      // safely extend the size of the matrix by "by" with 1 as a default value
      // behaviour with negative "by" value is undefined
      return this;
    },
    get : function (row, col) {
      // retrieve the value stored at (row, col)
      return 0;
    },
    set : function (row, col, value) {
      // store value at (row, col)
      return this;
    }
  },

  /**
   * equalSize performs an equality test of the sizes of both matrices
   * 
   * @param A
   *          {Matrix} first matrix
   * @param B
   *          {Matrix} second matrix
   * @return {Boolean} true if sizes are equal, false otherwise
   */
  equalSize : function (A, B) {
    return A.size === B.size && A.size !== undefined && A.size !== null;
  },

  /**
   * copies the specified row of the matrix to a populated vector
   * 
   * @param matrix
   *          {Matrix} matrix
   * @param row
   *          {Integer} row number
   * @return {Array} populated vector representing the row
   */
  getRow : function (matrix, row) {
    var vector, size, i;

    vector = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
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
   * @return {Array} populated vector representing the row
   */
  getCol : function (matrix, col) {
    var vector, size, i;

    vector = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
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
   * @return {Number} the row sum
   */
  rowSum : function (matrix, row) {
    var sum, size, i;

    sum = 0;
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      sum += matrix.get(row, i);
    }

    return sum;
  },

  /**
   * Calculates all row sums
   * 
   * @param matrix
   *          {Matrix} matrix
   * @return {Array} vector of row sums
   */
  rowSums : function (matrix) {
    var vector, size, i;

    vector = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      vector[i] = this.rowSum(matrix, i);
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
   * @return C
   */
  mult : function (A, B, C) {
    var size, val, row, col, i;

    size = A.size;

    if (C.size !== 0) {
      C.clear();
    }
    if (!this.equalSize(A, B)) {
      // console.error("Matrix.Mult: wrong sizes: ", A.size, " != ", B.size);
      return undefined;
    }

    C.extend(size);

    for (row = 0; row < size; row += 1) {
      for (col = 0; col < size; col += 1) {
        val = 0;
        for (i = 0; i < size; i += 1) {
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
   * @return {Array} resulting vector, which is fully populated with integer
   *          values
   */
  multVec : function (matrix, vector) {
    var retvec, size, i, j;

    retvec = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      retvec[i] = 0;
      for (j = 0; j < size; j += 1) {
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
   * @return {Number} the col sum
   */
  colSum : function (matrix, col) {
    var sum, size, i;

    sum = 0;
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      sum += matrix.get(i, col);
    }

    return sum;
  },

  /**
   * Calculates all col sums
   * 
   * @param matrix
   *          {Matrix} matrix
   * @return {Array} vector of col sums
   */
  colSums : function (matrix) {
    var vector, size, i;

    vector = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      vector[i] = this.colSum(matrix, i);
    }

    return vector;
  },

  /**
   * Transpose the matrix in place
   * 
   * @param matrix
   *          {Matrix} matrix to transpose
   * @return {Matrix} a reference to matrix
   */
  transpose : function (matrix) {
    var size, i, j, tmp;

    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      for (j = 0; j < i; j += 1) {
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
   * @return {Array} resulting vector, which is fully populated with integer
   *          values
   */
  vecMult : function (vector, matrix) {
    var retvec, size, i, j;

    retvec = [];
    size = matrix.size;

    for (i = 0; i < size; i += 1) {
      retvec[i] = 0;
      for (j = 0; j < size; j += 1) {
        retvec[i] += (vector[j] || 0) * matrix.get(j, i);
      }
    }

    return retvec;
  }
});
