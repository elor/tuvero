/**
 * PropertyModel: Store values as keys and emit events upon update.
 *
 * Basically, this is an Emitter wrapped around a native Hash Object, so please
 * use string keys and primary data types (Strings, Numbers, Boolean)
 *
 * @return PropertyModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'core/type'], function(extend, Model, Type) {
  /**
   * Constructor
   *
   * @param defaultProperties
   *          Optional. Native object from which to copy the initial properties
   */
  function PropertyModel(defaultProperties) {
    PropertyModel.superconstructor.call(this);

    this.props = {};

    // initialize with the init object, if available
    if (defaultProperties) {
      Object.keys(defaultProperties).forEach(function(key) {
        this.setProperty(key, defaultProperties[key]);
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
      if (Type.isString(value) || Type.isNumber(value)
          || Type.is(value, Boolean)) {
        this.props[key] = value;
        if (this.getProperty(key) === value) {
          this.emit('update', {
            key: key,
            value: value
          });
          return true;
        }
      } else {
        console.error('setProperty(): unsupported property type: '
            + Type(value));
      }
    }

    return false;
  };

  /**
   * retrieve the keys of this property
   *
   * @return an array of key names, i.e. an array of strings
   */
  PropertyModel.prototype.getPropertyKeys = function() {
    return Object.keys(this.props).sort();
  };

  /**
   * produce a readonly, functionless, unreferencing, serializable data object
   * that stores represents
   *
   * @return a data object
   */
  PropertyModel.prototype.save = function() {
    var data = PropertyModel.superclass.save.call(this);

    data.props = {};

    this.getPropertyKeys().forEach(function(key) {
      data.props[key] = this.getProperty(key);
    }, this);

    return data;
  };

  /**
   * restore the state from a data object. Keeps keys that aren't in data.
   *
   * @param data
   * @return true on success, false otherwise
   */
  PropertyModel.prototype.restore = function(data) {
    if (!PropertyModel.superclass.restore.call(this, data)) {
      return false;
    }

    Object.keys(data.props).forEach(function(key) {
      var val = data.props[key];
      this.setProperty(key, val);
    }, this);

    return true;
  };

  PropertyModel.prototype.SAVEFORMAT = Object
      .create(PropertyModel.superclass.SAVEFORMAT);
  PropertyModel.prototype.SAVEFORMAT.props = Object;

  return PropertyModel;
});
