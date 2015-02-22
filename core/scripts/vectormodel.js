/**
 * VectorModel, a vector class. Inherits from ListModel for convenience.
 *
 * @return VectorModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {
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
   *          Vector B
   * @return this
   */
  VectorModel.prototype.setProduct = function(vecA, vecB) {
    var index;

    if (vecA.length !== vecB.length) {
      console.error('VectorModel.setProduct: different input lengths: '
          + vecA.length + '<>' + vecB.length);
      return undefined;
    }

    this.resize(vecA.length);

    for (index = 0; index < this.length; index += 1) {
      this.set(index, vecA.get(index) * vecB.get(index));
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

  return VectorModel;
});
