/**
 * Event Emitter tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var Emitter;

    Emitter = getModule('core/emitter');

    QUnit.test('Emitter', function (assert) {
      var emitter, listener, listener2, eventcounter, resetcounter, retval;

      eventcounter = resetcounter = 0;

      emitter = undefined;
      listener = undefined;

      listener = {
        /**
         * test function
         */
        onundefined: function () {
          this.onreset();
        },
        /**
         * test function
         */
        onreset: function () {
          eventcounter = 0;
          resetcounter += 1;
        },
        /**
         * test function
         */
        onevent: function (_emitter, event) {
          eventcounter += 1;
          assert.equal(this, listener, 'onevent(): this equals listener');
          assert.equal(_emitter, emitter,
            'onevent(): first argument equals emitter ');
          assert.equal(event, 'event',
            'onevent(): second argument equals event string');
        },
        emitters: []
      };

      listener2 = {
        /**
         * test function
         */
        onevent: function () {
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

      assert.equal(retval, false,
        'Emitter: unreceived event returns false on emit()');

      emitter.registerListener(listener).registerListener(listener2);
      assert.equal(eventcounter + resetcounter, 0,
        'counters are at a zero state after listener registration');

      retval = emitter.emit('event');
      assert.equal(eventcounter, 2, "both listeners received 'event'");
      assert.equal(retval, true,
        'Emitter: received event returns true on emit()');

      emitter.registerListener(listener);
      retval = emitter.emit('event');
      assert.equal(eventcounter, 4, 'Cannot register an event listener twice');

      retval = emitter.emit('reset');
      assert.equal(eventcounter, 0, "counter was reset during 'reset' event");
      assert.equal(resetcounter, 1, 'reset was processed');

      retval = emitter.emit('event');
      retval = emitter.emit();
      assert.equal(resetcounter, 1,
        'default event (undefined) was not processed');
      assert.equal(eventcounter, 2,
        'onundefined callback function was not processed');

      emitter.emit('thisEventIsInvalid');
      assert.equal(eventcounter, 2, 'unspecified events are not processed');

      emitter.unregisterListener(listener);
      retval = emitter.emit('event');
      assert.equal(eventcounter, 3,
        'unregistered listeners do not receive events');

      retval = emitter.listeners.indexOf(listener);
      assert.equal(retval, -1, 'listeners are removed from emitter.listeners');
      retval = listener.emitters.indexOf(emitter);
      assert.equal(retval, -1, 'emitters are removed from listener.emitters');

      /*
       * emit+unregister test
       *
       * When unregistering a listener from a currently emitting emitter, the
       * listeners array is manipulated, possibly causing listeners to be
       * skipped. This is an error, which should be fixed
       */

      emitter = new Emitter();
      emitter.EVENTS = {
        'evt': true
      };
      listener2 = {
        success: false,
        onevt: function () {
          this.success = true;
        },
        emitters: []
      };
      listener = {
        onevt: function () {
          emitter.unregisterListener(this);
        },
        emitters: []
      };
      emitter.registerListener(listener);
      emitter.registerListener(listener2);
      emitter.emit('evt');
      assert.equal(listener2.success, true,
        'unregister during emit should not cause listeners to be skipped');

      /*
       * Mixin tests: when instantiating the emitter multiple times, the
       * 'listeners' array should not be overwritten!
       */

      emitter = new Emitter();
      emitter.EVENTS = {
        'evt': true
      };
      listener2.success = false;
      emitter.registerListener(listener2);
      Emitter.call(emitter); // mix-in
      emitter.emit('evt');
      assert.equal(listener2.success, true,
        'Mixin-initialization of an emitter preserves the listeners');

      /*
       * testing memory leak due to invalid forEach call
       */
      emitter = new Emitter();
      listener = {
        emitters: []
      };
      listener2 = {
        emitters: []
      };
      emitter.registerListener(listener);
      emitter.registerListener(listener2);
      emitter.destroy();

      assert.equal(listener.emitters.length, 0,
        'memleak: first listener was unregistered');
      assert.equal(listener2.emitters.length, 0,
        'memleak: second listener was unregistered');

      /*
       * Test Exception handling
       */

      emitter = new Emitter();
      emitter.EVENTS = {
        'evt': true
      };
      eventcounter = 0;
      listener = {
        onevt: function () {
          throw Error("Planned failure.");
        },
        emitters: []
      };
      listener2 = {
        onevt: function () {
          eventcounter += 1;
        },
        emitters: []
      };
      emitter.registerListener(listener);
      emitter.registerListener(listener2);
      emitter.emit('evt');
      emitter.emit('evt');

      assert.equal(eventcounter, 2, 'errors are intercepted');

    });
  };
});
