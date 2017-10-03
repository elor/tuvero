/**
 * a MWC random number generator. Not the best one, but it's sufficient for
 * tournaments. We're not carrying out scientific calculations, after all.
 *
 * @return Random
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  /**
   * constructor
   *
   * @param x
   *          Optional. the value seed. Defaults to a value derived from the
   *          millisecond-exact date
   * @param c
   *          Optional. the initial carry seed. Defaults to a value derived from
   *          the millisecond-exact date, but is guaranteed to differ from x
   */
  var Random = function(x, c) {
    var date;

    if (x !== undefined && c !== undefined) {
      this.x = x;
      this.c = c;
    } else {
      date = new Date();

      this.x = date.getTime() & 0xFFFF;
      this.c = (date.getTime() >> 16) & 0xFFFF;
    }
  };

  /**
   * highest integer number
   */
  Random.prototype.maxInt = 0x10000;

  /**
   * retrieve the next random int value
   *
   * @param top
   *          Optional. Return a value inside [0, top). Defaults to maxInt.
   * @return a random integer inside [0, top), if top is set, or [0, maxInt)
   *         otherwise
   */
  Random.prototype.nextInt = function(top) {
    if (top !== undefined) {
      return Math.floor(this.nextDouble() * top);
    }

    this.x = 65184 * this.x + this.c;
    this.c = this.x >> 16;
    this.x = this.x & 0xFFFF;

    return this.x;
  };

  /**
   * @return a random double value inside [0, 1)
   */
  Random.prototype.nextDouble = function() {
    return this.nextInt() / this.maxInt;
  };

  /**
   * @param array
   *          an array. Function may throw exceptions if array is not an array
   * @return a random element from the array
   */
  Random.prototype.pick = function(array) {
    return array[this.nextInt(array.length)];
  };

  /**
   * pick and remove an element from an array
   *
   * @param array
   *          an array. Function may throw exceptions if array is not an array
   * @return a randomly removed element from the array
   */
  Random.prototype.pickAndRemove = function(array) {
    return array.splice(this.nextInt(array.length), 1)[0];
  };

  return Random;
});
