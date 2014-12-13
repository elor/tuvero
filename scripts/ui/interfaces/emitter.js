/**
 * An event emitter class
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  /**
   * Constructor
   */
  function Emitter () {
    this.listeners = [];
  }

  /**
   * Emits an event to all registered listeners by calling the callback
   * functions of format 'on'+event, if available
   * 
   * The callback functions' parameters are the emitter (this) and the event
   * string (without 'on'), in this order.
   * 
   * @param event
   *          a string containing the name of the event. Callback functions need
   *          to have a function name in the format 'on'+event
   * @returns true if the some listener received the event, false otherwise
   */
  Emitter.prototype.emit = function (event) {
    var index, listener, success;

    success = false;

    for (index in this.listeners) {
      listener = this.listeners[index];
      if (listener['on' + event]) {
        listener['on' + event].call(listener, this, event);
        success = true;
      }
    }

    return success;
  };

  /**
   * register an event listener
   * 
   * @param listener
   *          an event listener instance, which should define the necessary
   *          callback functions
   * @returns this
   */
  Emitter.prototype.registerListener = function (listener) {
    this.unregisterListener(listener);
    this.listeners.push(listener);

    return this;
  };

  /**
   * Makes sure that the event listener is not receiving event callbacks anymore
   * 
   * @param listener
   *          an instance of the View class, which may have already been
   *          registered
   * @returns this
   */
  Emitter.prototype.unregisterListener = function (listener) {
    var index;

    index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }

    return this;
  };

  return Emitter;
});
