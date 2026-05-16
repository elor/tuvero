/**
 * LengthModel: binds to a ListModel instance and always evaluates to its length
 *
 * @return LengthModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import ValueModel from '../core/valuemodel.js';
/**
 * Constructor
 *
 * @param list
 *          a ListModel instance
 */
function LengthModel(list) {
  LengthModel.superconstructor.call(this, list.length);
  list.registerListener(this);
}
extend(LengthModel, ValueModel);

/**
 * callback listener
 *
 * @param list
 *          the emitter, i.e. the ListModel instance
 */
LengthModel.prototype.onresize = function (list) {
  LengthModel.superclass.set.call(this, list.length);
};

/**
 * disable the set() function. This is a passive ValueModel
 */
LengthModel.prototype.set = undefined;
export default LengthModel;