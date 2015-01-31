/**
 * An abstract model class
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './emitter'], function(extend, Emitter) {
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

  return Model;
});
