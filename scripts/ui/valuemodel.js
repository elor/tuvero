/**
 * A model, which stores a value and emits update events when it's changed
 *
 * @return ValueModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model'], function(extend, Model) {

  /**
   * Constructor
   *
   * @param value
   *          the initial value
   */
  function ValueModel(value) {
    ValueModel.superconstructor.call(this);

    this.set(value);
  }
  extend(ValueModel, Model);

  /**
   * set the value
   *
   * @param value
   *          the new value
   */
  ValueModel.prototype.set = function(value) {
    if (this.value !== value) {
      this.value = value;
      this.emit('update', value);
    }
  };

  /**
   * retrieve the value
   *
   * @return the stored value
   */
  ValueModel.prototype.get = function() {
    return this.value;
  };

  return ValueModel;
});
