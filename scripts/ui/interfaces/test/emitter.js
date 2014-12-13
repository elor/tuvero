/**
 * Event Emitter tests 
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  return function (QUnit, getModule) {
    var Emitter;

    Emitter = getModule('ui/interfaces/emitter');

    QUnit.test('Event Emitter', function () {
      var emitter, listener, listener2, eventcounter, resetcounter, retval;

      eventcounter = resetcounter = 0;
      
      listener = {
        onundefined : function (_emitter, event) {
          this.onreset();
        },
        onreset : function (_emitter, event) {
          eventcounter = 0;
          resetcounter += 1;
        },
        onevent : function (_emitter, event) {
          eventcounter += 1;
          QUnit.equal(this, listener, "onevent(): this equals listener");
          QUnit.equal(_emitter, emitter, "onevent(): first argument equals emitter ");
          QUnit.equal(event, 'event', "onevent(): second argument equals event string");
        }
      };

      listener2 = {
        onevent : function (_emitter, event) {
          eventcounter += 1;
        }
      };

      emitter = new Emitter();

      retval = emitter.emit('asd');

      QUnit.equal(retval, false, "Emitter: unreceived event returns false on emit()");

      emitter.registerListener(listener).registerListener(listener2);
      QUnit.equal(eventcounter + resetcounter, 0, "counters are at a zero state after listener registration");

      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 2, "both listeners received 'event'");
      QUnit.equal(retval, true, "Emitter: received event returns true on emit()");

      emitter.registerListener(listener);
      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 4, "Cannot register an event listener twice");

      retval = emitter.emit('reset');
      QUnit.equal(eventcounter, 0, "counter was reset during 'reset' event");
      QUnit.equal(resetcounter, 1, "reset was processed");

      retval = emitter.emit('event');
      retval = emitter.emit();
      QUnit.equal(resetcounter, 2, "default event ('undefined') was  processed");
      QUnit.equal(eventcounter, 0, "onundefined callback function was processed");

      emitter.unregisterListener(listener);
      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 1, "only one listener received the event after unregistering the other one");
    });
  };
});
