import ValueModel from '../core/valuemodel.js';

/**
 * Constructor
 *
 * @param list
 *          a ListModel instance
 */
class LengthModel extends ValueModel {
  constructor(list) {
    super(list.length);
    list.registerListener(this);
  }

  /**
   * callback listener
   *
   * @param list
   *          the emitter, i.e. the ListModel instance
   */
  onresize(list) {
    super.set(list.length);
  }
}

/**
 * disable the set() function. This is a passive ValueModel
 */
LengthModel.prototype.set = undefined;
export default LengthModel;