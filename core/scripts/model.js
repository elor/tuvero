/**
 * An abstract model class
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/emitter'], function(extend, Emitter) {
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
    return true;
  };

  return Model;
});
