/**
 * Vector variable to contain all vector operations and definitions
 */
var Vector = {
  /**
   * The representation of a vector is a basic Javascript array
   */
  Interface : [],

  /**
   * dot product of two vectors
   * 
   * @param a
   *          {Array} first operand
   * @param b
   *          {Array} second operand
   * @param size
   *          {Integer} supposed size of the vectors (optional, defaults to
   *          max(a.length, b.length))
   * @returns {Number}
   */
  Dot : function(a, b, size) {
    size = size || Math.max(a.length, b.length);
    var retval = 0;
    for ( var i = 0; i < size; ++i) {
      retval += (a[i] || 0) * (b[i] || 0);
    }
    return retval;
  },

  /**
   * Sum calculates the sum of all elements of the vector
   * 
   * @param vector
   *          {Array} input vector
   * @returns {Number} the vector sum
   */
  Sum : function(vector) {
    var sum = 0;
    var size = vector.length;

    for ( var i = 0; i < size; ++i) {
      sum += vector[i] || 0;
    }

    return sum;
  },

  /**
   * Fills undefined elements of the vector with 0
   * 
   * @param vector
   *          {Array} input and output vector
   * @returns {Array} reference to the vector
   */
  Fill : function(vector) {
    var size = vector.length;

    for ( var i = 0; i < size; ++i) {
      vector[i] = vector[i] || 0;
    }

    return vector;
  },
};
