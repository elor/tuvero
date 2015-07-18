/**
 * LengthModel: binds to a ListModel instance and always evaluates to its length
 *
 * @return LengthModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './valuemodel'], function(extend, ValueModel) {
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
  LengthModel.prototype.onresize = function(list) {
    LengthModel.superclass.set.call(this, list.length);
  };

  /**
   * disable the set() function. This is a passive ValueModel
   */
  LengthModel.prototype.set = undefined;

  return LengthModel;
});
