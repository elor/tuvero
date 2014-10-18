/**
 * Vector variable to contain all vector operations and definitions where a
 * vector is represented as a javascript array
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  var Vector;

  Vector = {
    /**
     * Copies the the vector into a new sparse array
     * 
     * @param vector
     *          {Array} source
     * @return {Array} copy
     */
    copy : function (vector) {
      var ret, size, i;

      ret = [];
      size = vector.length;

      for (i = 0; i < size; i += 1) {
        if (vector[i]) {
          ret[i] = vector[i];
        }
      }

      return ret;
    },

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
     * @return {Number}
     */
    dot : function (a, b, size) {
      var retval, i;

      size = size || Math.max(a.length, b.length);
      retval = 0;

      for (i = 0; i < size; i += 1) {
        retval += (a[i] || 0) * (b[i] || 0);
      }
      return retval;
    },

    /**
     * Fills undefined elements of the vector with 0
     * 
     * @param vector
     *          {Array} input and output vector
     * @return {Array} reference to the vector
     */
    fill : function (vector) {
      var size, i;

      size = vector.length;

      for (i = 0; i < size; i += 1) {
        vector[i] = vector[i] || 0;
      }

      return vector;
    },
    /**
     * scales the vector by the factor
     * 
     * @param vector
     *          {Array} vector
     * @param factor
     *          {Number} factor
     * @return {Array} reference to vector
     */
    scale : function (vector, factor) {
      var size, i;

      size = vector.length;

      for (i = 0; i < size; i += 1) {
        if (vector[i]) {
          vector[i] *= factor;
        }
      }

      return vector;
    },

    /**
     * Sum calculates the sum of all elements of the vector
     * 
     * @param vector
     *          {Array} input vector
     * @return {Number} the vector sum
     */
    sum : function (vector) {
      var sum, size, i;

      sum = 0;
      size = vector.length;

      for (i = 0; i < size; i += 1) {
        sum += vector[i] || 0;
      }

      return sum;
    }
  };

  return Vector;
});
