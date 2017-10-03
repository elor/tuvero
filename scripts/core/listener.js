/**
 * An event emitter class
 *
 * @return Listener
 * @author Erik E. Lorenz <erik@tuvero.de>
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
   * anonymous one-line listener, which just registers the callback.
   *
   * @param emitter
   *          the emitter
   * @param events
   *          a comma-separated list of events to listen to
   * @param callback
   *          the callback function
   * @param thisArg
   *          Optional. "this" for the callback function. Defaults to the
   *          returned listener
   * @return the internally created Listener, e.g. for destroy() calls
   */
  Listener.bind = function(emitter, events, callback, thisArg) {
    var listener, initialCallback;

    if (thisArg) {
      initialCallback = function(_emitter, _event, data) {
        callback.call(thisArg, _emitter, _event, data);
      };
    } else {
      initialCallback = callback;
    }

    listener = new Listener(emitter);

    events.split(',').forEach(function(event) {
      // trim spaces
      event = event.replace(/^\s+|\s+$/g, '');

      if (emitter.EVENTS[event]) {
        listener['on' + event] = initialCallback;
      } else {
        console.error('Listener.bind: emitter does not emit event:"' + event);
      }
    });

    return listener;
  };

  /**
   * destroy the listener, i.e. remove it from all emitters
   */
  Listener.prototype.destroy = function() {
    while (this.emitters.length > 0) {
      this.emitters[0].unregisterListener(this);
    }
  };
  return Listener;
});
