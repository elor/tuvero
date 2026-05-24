import Model from './model.js';
import MatchResult from './matchresult.js';

/**
 * Constructor
 *
 * @param oldResult
 *          the result before the correction
 * @param newResult
 *          the result after the correction
 */
class CorrectionModel extends Model {
  constructor(oldResult, newResult) {
    super();
    if (oldResult === undefined) {
      this.before = new MatchResult();
    } else if (oldResult instanceof MatchResult) {
      this.before = oldResult;
    } else {
      throw new Error('CorrectionModel: oldResult is not a MatchResult!');
    }
    if (newResult === undefined) {
      this.after = new MatchResult();
    } else if (newResult instanceof MatchResult) {
      this.after = newResult;
    } else {
      throw new Error('CorrectionModel: newResult is not a MatchResult!');
    }
  }

  /**
   * gather the data and return it as a serializable object
   *
   * @return a serializable data object
   */
  save() {
    const data = super.save();
    data.b = this.before.save();
    data.a = this.after.save();
    return data;
  }

  /**
   * restore a previous state, which has been saved with the 'save()' function
   *
   * @param data
   *          a deserialized data object
   * @return true on success, false otherwise
   */
  restore(data) {
    if (!super.restore(data)) {
      return false;
    }
    if (!this.before.restore(data.b)) {
      return false;
    }
    if (!this.after.restore(data.a)) {
      return false;
    }
    return true;
  }
}

/**
 * This model does not emit events. It's for storage only.
 */
CorrectionModel.prototype.EVENTS = {};

CorrectionModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT);
CorrectionModel.prototype.SAVEFORMAT.a = Object;
CorrectionModel.prototype.SAVEFORMAT.b = Object;
export default CorrectionModel;