import Model from './model.js';
import Type from './type.js';

/**
 * Constructor
 *
 * @param defaultProperties
 *          Optional. Native object from which to copy the initial properties
 */
class PropertyModel extends Model {
  constructor(defaultProperties) {
    super();
    this.props = {};

    // initialize with the init object, if available
    if (defaultProperties) {
      Object.keys(defaultProperties).forEach(function (key) {
        this.setProperty(key, defaultProperties[key]);
      }, this);
    }
  }

  /**
   * retrieve the value from the key
   *
   * @param key
   *          String. the key
   * @return the value which is stored under the key
   */
  getProperty(key) {
    return this.props[key];
  }

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
  setProperty(key, value) {
    if (this.getProperty(key) !== value) {
      if (Type.isString(value) || Type.isNumber(value) || Type.is(value, Boolean)) {
        this.props[key] = value;
        if (this.getProperty(key) === value) {
          this.emit('update', {
            key: key,
            value: value
          });
          return true;
        }
      } else {
        console.error('setProperty(): unsupported property type: ' + Type(value));
      }
    }
    return false;
  }

  /**
   * retrieve the keys of this property
   *
   * @return an array of key names, i.e. an array of strings
   */
  getPropertyKeys() {
    return Object.keys(this.props).sort();
  }

  /**
   * produce a readonly, functionless, unreferencing, serializable data object
   * that stores represents
   *
   * @return a data object
   */
  save() {
    const data = super.save();
    data.props = {};
    this.getPropertyKeys().forEach(function (key) {
      data.props[key] = this.getProperty(key);
    }, this);
    return data;
  }

  /**
   * restore the state from a data object. Keeps keys that aren't in data.
   *
   * @param data
   * @return true on success, false otherwise
   */
  restore(data) {
    if (!super.restore(data)) {
      return false;
    }
    Object.keys(data.props).forEach(function (key) {
      const val = data.props[key];
      this.setProperty(key, val);
    }, this);
    return true;
  }
}

PropertyModel.prototype.EVENTS = {
  'update': true
};

PropertyModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT);
PropertyModel.prototype.SAVEFORMAT.props = Object;
export default PropertyModel;