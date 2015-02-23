/**
 * VectorModel, a vector class. Inherits from ListModel for convenience.
 *
 * @return VectorModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel', 'ui/type'], function(extend, ListModel,
    Type) {
  /**
   * Constructor
   *
   * @param size
   *          Optional. The initial size of the vector
   */
  function VectorModel(size) {
    VectorModel.superconstructor.call(this);

    this.resize(size);
  }
  extend(VectorModel, ListModel);

  /**
   * resize function: pop or push elements until the target size is reached
   *
   * @param size
   */
  VectorModel.prototype.resize = function(size) {
    if (size === undefined || size < 0) {
      size = 0;
    }

    while (this.length > size) {
      this.pop();
    }
    while (this.length < size) {
      this.push(0);
    }
  };

  /**
   * set the whole vector to one value
   *
   * @param value
   *          Optional. The value. Defaults to 0.
   */
  VectorModel.prototype.fill = function(value) {
    var index;

    value = value || 0;

    for (index = 0; index < this.length; index += 1) {
      this.set(index, value);
    }
  };

  /**
   * calculate and return the vector sum
   *
   * @return the vector sum
   */
  VectorModel.prototype.sum = function() {
    return this.list.reduce(function(a, b) {
      return a + b;
    });
  };

  /**
   * sets the vector contens with the element-wise product of two vectors
   *
   * @param vecA
   *          Vector A
   * @param vecB
   *          Optional. Vector B. defaults to this.
   * @return this
   */
  VectorModel.prototype.mult = function(vecA, vecB) {
    var index;

    if (Type.isNumber(vecB)) {
      throw new Error('VectorModel.prototype.mult: '
          + 'second argument must be undefined or a VectorModel instance: '
          + vecB);
    }

    vecB = vecB || this;

    if (Type.isNumber(vecA)) {
      // numerical multiplication
      this.resize(vecB.length);
      for (index = 0; index < this.length; index += 1) {
        this.set(index, vecB.get(index) * vecA);
      }
    } else {
      // element-wise multiplication
      if (vecA.length !== vecB.length) {
        console.error('VectorModel.setProduct: different input lengths: '
            + vecA.length + '<>' + vecB.length);
        return undefined;
      }

      this.resize(vecB.length);

      for (index = 0; index < this.length; index += 1) {
        this.set(index, vecA.get(index) * vecB.get(index));
      }
    }

    return this;
  };

  /**
   * calculate and return the dot product of this and another vector
   *
   * @param vec
   *          the other vector
   * @return the dot product, (this . vec)
   */
  VectorModel.prototype.dot = function(vec) {
    var index, sum;

    if (this.length != vec.length) {
      console.error('VectorModel.dot: different input lengths: ' + this.length
          + '<>' + vec.length);
      return undefined;
    }

    sum = 0;
    for (index = 0; index < this.length; index += 1) {
      sum += this.get(index) * vec.get(index);
    }

    return sum;
  };

  /**
   * Adds two vectors and stores the results in this. If the second vector is
   * undefined, vector 1 is added to this.
   *
   * @param vec1
   *          vector 1
   * @param vec2
   *          Optional. vector 2. Defaults to this.
   * @return this on success, undefined otherwise
   */
  VectorModel.prototype.add = function(vec1, vec2) {
    var index;

    vec2 = vec2 || this;

    if (vec1.length !== vec2.length) {
      console.error('VectorModel.prototype.add: different input lengths: '
          + +vec1.length + '<>' + vec2.length);
      return undefined;
    }

    this.resize(vec1.length);

    for (index = 0; index < this.length; index += 1) {
      this.set(index, vec1.get(index) + vec2.get(index));
    }

    return this;
  };

  return VectorModel;
});
