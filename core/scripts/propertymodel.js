/**
 * PropertyModel: Store values as keys and emit events upon update.
 *
 * Basically, this is an Emitter wrapped around a native Hash Object, so please
 * use string keys.
 *
 * @return PropertyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model'], function(extend, Model) {
  /**
   * Constructor
   *
   * @param init
   *          Optional. Native object from which to copy the initial properties
   */
  function PropertyModel(init) {
    PropertyModel.superconstructor.call(this);

    this.props = {};

    // initialize with the init object, if available
    if (init) {
      Object.keys(init).forEach(function(key) {
        this.set(key, init[key]);
      }, this);
    }
  }
  extend(PropertyModel, Model);

  PropertyModel.prototype.EVENTS = {
    'update': true
  };

  /**
   * retrieve the value from the key
   *
   * @param key
   *          String. the key
   * @return the value which is stored under the key
   */
  PropertyModel.prototype.getProperty = function(key) {
    return this.props[key];
  };

  /**
   * store the value and emit an event if and only if the value has been changed
   * or the key was first inserted.
   *
   * @param key
   *          String. the key
   * @param value
   *          the value to store under the key
   * @return true on success, false otherwise
   */
  PropertyModel.prototype.setProperty = function(key, value) {
    if (this.getProperty(key) !== value) {
      this.props[key] = value;
      if (this.getProperty(key) === value) {
        this.emit('update', {
          key: key,
          value: value
        });
        return true;
      }
    }

    return false;
  };

  return PropertyModel;
});
