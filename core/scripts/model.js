/**
 * An abstract model class
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/emitter'], function(extend, Emitter) {
  function getClassName(instance) {
    return instance.constructor.toString().replace(
        /^function (\S+)\((.+|\s+)*$/g, "$1");
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

  /**
   * save the state of this object, so it can later be restored using the
   * restore() function. Subclasses are supposed to call superclass.save()
   * instead of instantiating their own data object.
   *
   * @return a data object
   */
  Model.prototype.save = function() {
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
  Model.prototype.restore = function(data) {
    // TODO warn about additional keys
    // TODO allow for the verification of sub-Models
    if (!Type.isObject(data) || !Type.isObject(this.SAVEFORMAT)) {
      return false;
    }

    return Object.keys(this.SAVEFORMAT).every(function(key) {
      var subdata, referenceType;

      referenceType = this.SAVEFORMAT[key];
      subdata = data[key];

      if (Type.isArray(referenceType)) {
        if (Type.isArray(subdata)) {
          if (referenceType.length === 1) {
            referenceType = referenceType[0];
            return subdata.every(function(subdataElement) {
              if (Type.is(subdataElement, referenceType)) {
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

      if (Type.is(subdata, referenceType)) {
        return true;
      }

      console.error(getClassName(this) + ".restore(): missing Key: " + key);
      return false;
    }, this);
  };

  Model.prototype.SAVEFORMAT = {};

  return Model;
});
