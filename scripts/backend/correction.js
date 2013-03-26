/**
 * A correction ties a wrong game result to a new game result. This structure is
 * intended for secure storage only, hence the copying efforts. Since
 * corrections should be sparse, the copying shouldn't matter.
 */
define(function () {
  var Correction;

  /**
   * constructor
   * 
   * @param pre
   *          previous result (Result instance)
   * @param post
   *          corrected result (Result instance)
   * @returns {Correction} new instance
   */
  Correction = function (pre, post) {
    this.pre = pre.copy();
    this.post = post.copy();
  };

  /**
   * copy function that creates a new correction from this
   * 
   * @returns {Correction} copy
   */
  Correction.prototype.copy = function () {
    return new Correction(this.pre, this.post);
  };

  return Correction;
});
