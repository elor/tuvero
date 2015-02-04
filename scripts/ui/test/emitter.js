/**
 * Event Emitter tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var Emitter;

    Emitter = getModule('ui/emitter');

    QUnit.test('Emitter', function() {
      var emitter, listener, listener2, eventcounter, resetcounter, retval;

      eventcounter = resetcounter = 0;

      emitter = undefined;
      listener = undefined;

      listener = {
        /**
         * test function
         */
        onundefined: function() {
          this.onreset();
        },
        /**
         * test function
         */
        onreset: function() {
          eventcounter = 0;
          resetcounter += 1;
        },
        /**
         * test function
         */
        onevent: function(_emitter, event) {
          eventcounter += 1;
          QUnit.equal(this, listener, 'onevent(): this equals listener');
          QUnit.equal(_emitter, emitter,
              'onevent(): first argument equals emitter ');
          QUnit.equal(event, 'event',
              'onevent(): second argument equals event string');
        },
        emitters: []
      };

      listener2 = {
        /**
         * test function
         */
        onevent: function() {
          eventcounter += 1;
        },
        emitters: []
      };

      emitter = new Emitter();
      emitter.EVENTS = {
        'asd': true,
        'event': true,
        'reset': true
      };

      retval = emitter.emit('asd');

      QUnit.equal(retval, false,
          'Emitter: unreceived event returns false on emit()');

      emitter.registerListener(listener).registerListener(listener2);
      QUnit.equal(eventcounter + resetcounter, 0,
          'counters are at a zero state after listener registration');

      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 2, "both listeners received 'event'");
      QUnit.equal(retval, true,
          'Emitter: received event returns true on emit()');

      emitter.registerListener(listener);
      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 4, 'Cannot register an event listener twice');

      retval = emitter.emit('reset');
      QUnit.equal(eventcounter, 0, "counter was reset during 'reset' event");
      QUnit.equal(resetcounter, 1, 'reset was processed');

      retval = emitter.emit('event');
      retval = emitter.emit();
      QUnit.equal(resetcounter, 1,
          'default event (undefined) was not processed');
      QUnit.equal(eventcounter, 2,
          'onundefined callback function was not processed');

      emitter.emit('thisEventIsInvalid');
      QUnit.equal(eventcounter, 2, 'unspecified events are not processed');

      emitter.unregisterListener(listener);
      retval = emitter.emit('event');
      QUnit.equal(eventcounter, 3,
          'unregistered listeners do not recieve events');

      retval = emitter.listeners.indexOf(listener);
      QUnit.equal(retval, -1, 'listeners are removed from emitter.listeners');
      retval = listener.emitters.indexOf(emitter);
      QUnit.equal(retval, -1, 'emitters are removed from listener.emitters');
    });
  };
});
