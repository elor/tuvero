import ListModel from '../list/listmodel.js'
import Type from '../core/type.js'
import RLE from '../core/rle.js'

/**
 * Constructor
 *
 * @param size
 *          Optional. The initial size of the vector
 */
class VectorModel extends ListModel {
  constructor (size) {
    super()
    this.resize(size)
  }

  /**
   * resize function: pop or push elements until the target size is reached
   *
   * @param size
   */
  resize (size) {
    if (size === undefined || size < 0) {
      size = 0
    }
    while (this.length > size) {
      this.pop()
    }
    while (this.length < size) {
      this.push(0)
    }
  }

  /**
   * set the whole vector to one value
   *
   * @param value
   *          Optional. The value. Defaults to 0.
   */
  fill (value) {
    let index
    value = value || 0
    for (index = 0; index < this.length; index += 1) {
      this.set(index, value)
    }
  }

  /**
   * sets the vector contens with the element-wise product of two vectors
   *
   * @param vecA
   *          Vector A
   * @param vecB
   *          Optional. Vector B. defaults to this.
   * @return this
   */
  mult (vecA, vecB) {
    let index
    if (Type.isNumber(vecB)) {
      throw new Error('VectorModel.prototype.mult: ' + 'second argument must be undefined or a VectorModel instance: ' + vecB)
    }
    vecB = vecB || this
    if (Type.isNumber(vecA)) {
      // numerical multiplication
      this.resize(vecB.length)
      for (index = 0; index < this.length; index += 1) {
        this.set(index, vecB.get(index) * vecA)
      }
    } else {
      // element-wise multiplication
      if (vecA.length !== vecB.length) {
        console.error('VectorModel.setProduct: different input lengths: ' + vecA.length + '<>' + vecB.length)
        return undefined
      }
      this.resize(vecB.length)
      for (index = 0; index < this.length; index += 1) {
        this.set(index, vecA.get(index) * vecB.get(index))
      }
    }
    return this
  }

  /**
   * calculate and return the dot product of this and another vector
   *
   * @param vec
   *          the other vector
   * @return the dot product, (this . vec)
   */
  dot (vec) {
    let index, sum
    if (this.length !== vec.length) {
      console.error('VectorModel.dot: different input lengths: ' + this.length + '<>' + vec.length)
      return undefined
    }
    sum = 0
    for (index = 0; index < this.length; index += 1) {
      sum += this.get(index) * vec.get(index)
    }
    return sum
  }

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
  sum (vec1, vec2) {
    let index
    vec2 = vec2 || this
    if (vec1.length !== vec2.length) {
      console.error('VectorModel.prototype.sum: different input lengths: ' + vec1.length + '<>' + vec2.length)
      return undefined
    }
    this.resize(vec1.length)
    for (index = 0; index < this.length; index += 1) {
      this.set(index, vec1.get(index) + vec2.get(index))
    }
    return this
  }

  add (index, summand) {
    this.set(index, this.get(index) + summand)
  }

  /**
   * prepare a compact serializable representation of the vector
   *
   * @return a data object
   */
  save () {
    let data = super.save()
    data = RLE.encode(data)
    return data
  }

  /**
   * restore the vector from a previously saved data object
   *
   * @param data
   *          the data object
   * @return true on success, false otherwise
   */
  restore (data) {
    let index
    try {
      data = RLE.decode(data)
    } catch (e) {
      console.error(e)
      return false
    }
    if (!super.restore(data)) {
      return false
    }
    while ((index = this.indexOf(undefined)) !== -1) {
      this.set(index, 0)
    }
    return true
  }
}

VectorModel.prototype.SAVEFORMAT = Object.create(ListModel.prototype.SAVEFORMAT)
VectorModel.prototype.SAVEFORMAT.v = [Number]
export default VectorModel
