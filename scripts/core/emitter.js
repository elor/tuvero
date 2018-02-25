/**
 * An event emitter class
 *
 * @return Emitter
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener'], function (extend, Listener) {
  var depth;

  depth = 0;

  function getClassName(instance) {
    return instance.constructor.toString().split('\n')[0].replace(
      /function (\S+)\(.*/, '$1');
  }

  /**
   * Constructor
   */
  function Emitter() {
    Emitter.superconstructor.call(this, undefined);

    if (this.listeners === undefined) {
      this.listeners = [];
    }

    if (Emitter.debug && this.EVENTS.update) {
      console.warn(getClassName(this)
        + ": The use of the 'update' event is discouraged.");
      console.warn("   Cause: The meaning of 'update' is ambiguous");
    }
  }
  extend(Emitter, Listener);
  Emitter.prototype.EVENTS = {
    'update': true,
    'reset': true
  }; // Default Events

  // TODO somehow restrict the events that can be emitted. This has to be
  // visible to the user (i.e. programmers)!

  /**
   * Emits an event to all registered listeners by calling the callback
   * functions of format 'on'+event, if available
   *
   * The callback functions' parameters are the emitter (this), the event string
   * (without 'on') and an optional data object, in this order.
   *
   * @param event
   *          a string containing the name of the event. Callback functions need
   *          to have a function name in the format 'on'+event
   * @param data
   *          arbitrary additional data. Please keep it simple!
   * @return true if the some listener received the event, false otherwise
   */
  Emitter.prototype.emit = function (event, data) {
    var success, indentation;

    success = false;

    if (!this.validEvent(event)) {
      console.error('Emitter: unspecified event type: ' + event);
      return false;
    }

    /*
     * Iterate over every listener in order. We call slice() to copy the array,
     * so that unregisterListener()-calls don't cause other listeners to be
     * skipped. Have a look at the corresponding unit test.
     */
    depth += 1;

    if (Emitter.debug) {
      indentation = '>';
      while (indentation.length <= depth) {
        indentation += ' ';
      }
      console.log(indentation + getClassName(this) + '.emit(' + event
        + ') with ' + this.listeners.length + ' listeners');
    }

    this.listeners.slice().forEach(function (listener) {
      if (listener['on' + event]) {
        try {
          listener['on' + event].call(listener, this, event, data);
          success = true;
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            console.error(e.name);
            console.error(e.message);
            if (e.stack) {
              console.error(e.stack)
            }
          }
        }
      }
    }, this);

    depth -= 1;

    return success;
  };

  /**
   * validate the event type
   *
   * @param event
   *          an event string, e.g. 'update'
   * @return true if the event type is defined, false otherwise
   */
  Emitter.prototype.validEvent = function (event) {
    return this.EVENTS && !!this.EVENTS[event];
  };

  /**
   * register an event listener
   *
   * @param listener
   *          an event listener instance, which should define the necessary
   *          callback functions
   * @return this
   */
  Emitter.prototype.registerListener = function (listener) {
    this.unregisterListener(listener);
    this.listeners.push(listener);
    listener.emitters.push(this);

    return this;
  };

  /**
   * Makes sure that the event listener is not receiving event callbacks anymore
   *
   * @param listener
   *          an instance of the View class, which may have already been
   *          registered
   * @return this
   */
  Emitter.prototype.unregisterListener = function (listener) {
    var index;

    index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }

    if (listener.emitters) {
      index = listener.emitters.indexOf(this);
      if (index !== -1) {
        listener.emitters.splice(index, 1);
      }
    }

    return this;
  };

  /**
   * unregister all related listeners
   */
  Emitter.prototype.destroy = function () {
    Emitter.superclass.destroy.call(this);

    while (this.listeners.length > 0) {
      this.unregisterListener(this.listeners[0]);
    }
  };

  /**
   * enable/disable debugging log
   */
  Emitter.debug = false;

  return Emitter;
});
