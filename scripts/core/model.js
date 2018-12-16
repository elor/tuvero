/**
 * An abstract model class
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/emitter", "core/type"], function (extend, Emitter, Type) {
  function getClassName(instance) {
    return instance.constructor.toString().replace(
      /^function (\S+)\((.+|\s+)*$/g, "$1");
  }

  /**
   * match the type of data against referenceType. Also allows to match
   * equal-depth multidimensional arrays with a single contained data type
   *
   * @param data
   * @param referenceType
   * @return true if the types match, false otherwise
   */
  function verifyType(data, referenceType) {
    if (Type.isArray(referenceType)) {
      if (Type.isArray(data)) {
        if (referenceType.length === 1) {
          return data.every(function (dataElement) {
            if (verifyType(dataElement, referenceType[0])) {
              return true;
            }

            console.error("restore(): Array element does not match type");
            return false;
          });
        }
        console.error("SAVEFORMAT array does not contain exactly 1 Type!");
      }
      return false;
    }

    if (Type.is(data, referenceType)) {
      return true;
    }

    console.error(getClassName(this) + ".restore(): missing Key of type " +
      referenceType);
    return false;
  }

  /**
   * Constructor for setting an initial state.
   *
   * Please provide additional functions in order to allow state modifications.
   * Use this.emit() to signal state changes to registered views
   */
  function Model() {
    Model.superconstructor.call(this);
  }
  extend(Model, Emitter);

  Model.prototype.clone = function () {
    var clone = new this.constructor();
    if (!clone.restore(this.save())) {
      throw "Cannot clone object " + this;
    }
    return clone;
  };

  Model.prototype.clone = function (source) {
    this.restore(source.save());
  };

  /**
   * save the state of this object, so it can later be restored using the
   * restore() function. Subclasses are supposed to call superclass.save()
   * instead of instantiating their own data object.
   *
   * @return a data object
   */
  Model.prototype.save = function () {
    // TODO auto-verify the format
    return {};
  };

  /**
   * restore the state from a saved state, as written by save(); Subclasses are
   * supposed to call superclass.save() before restoring their own state.
   *
   * @param data
   *          a data object as written by save()
   * @return true on success, false or undefined otherwise
   */
  Model.prototype.restore = function (data) {
    // TODO warn about additional keys
    // TODO allow for the verification of sub-Models
    if (!Type.isObject(data)) {
      console.error("restore(): data is not an object");
      return false;
    }

    if (!Type.isObject(this.SAVEFORMAT)) {
      console.error("restore(): SAVEFORMAT is not an object");
      return false;
    }

    return Object.keys(this.SAVEFORMAT).every(function (key) {
      if (verifyType.call(this, data[key], this.SAVEFORMAT[key])) {
        return true;
      }
      console.error("Missing key or wrong format: " + key);
      console.log(data);
      return false;
    }, this);
  };

  Model.prototype.SAVEFORMAT = {};

  return Model;
});