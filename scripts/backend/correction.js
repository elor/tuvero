/**
 * A correction ties a wrong game result to a new game result. This structure is
 * intended for secure storage only, hence the copying efforts. Since
 * corrections should be sparse, the copying shouldn't matter.
 */
define([ './result' ], function (Result) {
  var Correction;

  /**
   * constructor
   * 
   * @param pre
   *          previous result (Result instance)
   * @param post
   *          corrected result (Result instance)
   * @return {Correction} new instance
   */
  Correction = function (pre, post) {
    this.pre = pre.copy();
    this.post = post.copy();
  };

  /**
   * copy function that creates a new correction from this
   * 
   * @return {Correction} copy
   */
  Correction.prototype.copy = function () {
    return new Correction(this.pre, this.post);
  };

  /**
   * copies a correction object
   * 
   * @param corr
   *          correction object, which doesn't have to have the same prototype
   *          and functions. Fields are sufficient
   * @return the instance
   */
  Correction.copy = function (corr) {
    return new Correction(Result.copy(corr.pre), Result.copy(corr.post));
  };

  return Correction;
});
