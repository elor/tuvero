/**
 * An event emitter class
 *
 * @return Listener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  /**
   * Constructor
   *
   * @param emitter
   */
  function Listener(emitter) {
    if (!this.emitters) {
      this.emitters = [];
    }

    if (emitter) {
      emitter.registerListener(this);
    }
  }

  /**
   * destroy the listener, i.e. remove it from all emitters
   */
  Listener.prototype.destroy = function() {
    this.emitters.forEach(function(emitter) {
      emitter.unregisterListener(this);
    }, this);
  };
  return Listener;
});
