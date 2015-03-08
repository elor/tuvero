/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/**
 * A model, which stores a value and emits update events when it's changed
 *
 * @return ValueModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {

  /**
   * Constructor
   *
   * @param value
   *          the initial value
   */
  function ValueModel(value) {
    ValueModel.superconstructor.call(this);

    ValueModel.prototype.set.call(this, value);
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

  /**
   * bind this value to another value without re-registering the listeners. The
   * connection is one-way only, but two symmetric bind calls are supported.
   *
   * Does not work if onupdate() is overwritten to avoid undefined behaviour.
   * This function is intended to be used to catch state changes in static
   * structures, such as the image parameter in the tabs, which could be mapped
   * to the team size.
   *
   * @param valueModel
   *          the other value model
   */
  ValueModel.prototype.bind = function(valueModel) {
    if (this.onupdate === ValueModel.onupdate) {
      valueModel.registerListener(this);
      this.onupdate(valueModel);
    }
  };

  /**
   * Callback function
   *
   * @param emitter
   */
  ValueModel.prototype.onupdate = function(emitter) {
    this.set(emitter.get());
  };

  return ValueModel;
});
