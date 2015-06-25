/**
 * CorrectionModel: store and serialize/deserialize a correction, i.e. the
 * change of a match result.
 *
 * @return CorrectionModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './matchresult'], function(extend, Model,
    MatchResult) {
  /**
   * Constructor
   *
   * @param oldResult
   *          the result before the correction
   * @param newResult
   *          the result after the correction
   */
  function CorrectionModel(oldResult, newResult) {
    CorrectionModel.superconstructor.call(this);

    this.before = oldResult || new MatchResult();
    this.after = newResult || new MatchResult();
  }
  extend(CorrectionModel, Model);

  /**
   * This model does not emit events. It's for storage only.
   */
  CorrectionModel.prototype.EVENTS = {};

  /**
   * gather the data and return it as a serializable object
   *
   * @return a serializable data object
   */
  CorrectionModel.prototype.save = function() {
    var data = CorrectionModel.superclass.save.call(this);

    data.b = this.before.save();
    data.a = this.after.save();

    return data;
  };

  /**
   * restore a previous state, which has been saved with the 'save()' function
   *
   * @param data
   *          a deserialized data object
   * @returns true on success, false otherwise
   */
  CorrectionModel.prototype.restore = function(data) {
    if (!CorrectionModel.superclass.restore.call(this, data)) {
      return false;
    }

    if (!this.before.restore(data.b)) {
      return false;
    }

    if (!this.after.restore(data.a)) {
      return false;
    }

    return true;
  };

  return CorrectionModel;
});
