/**
 * tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var Emitter, Listener;

    Emitter = getModule('core/emitter');
    Listener = getModule('core/listener');

    QUnit.test('Listener', function() {
      var emitter, emitter2, listener;

      emitter = new Emitter();
      emitter2 = new Emitter();
      emitter2.numListeners = function() {
        return this.listeners.length;
      };

      listener = new Listener(emitter);
      listener.updatecount = 0;
      listener.onupdate = function() {
        this.updatecount += 1;
      };
      listener.numEmitters = function() {
        return this.emitters.length;
      };

      QUnit.equal(listener.numEmitters(), 1,
          'listener initializes with an emitter');

      emitter.emit('update');
      QUnit.equal(listener.updatecount, 1,
          'update event received from emitter1');

      emitter2.registerListener(listener);
      QUnit.equal(listener.numEmitters(), 2, 'registerListener adds emitter2');

      emitter2.emit('update');
      QUnit.equal(listener.updatecount, 2, 'receiving events from emitter2');

      emitter.unregisterListener(listener);
      QUnit.equal(listener.numEmitters(), 1,
          'emitter.destroy() unregisters the listener');

      emitter.registerListener(listener);
      QUnit.equal(listener.numEmitters(), 2, 're-registering the emitter');

      emitter.destroy();
      QUnit.equal(listener.numEmitters(), 1,
          'emitter.destroy() unregisters the listener');

      listener.destroy();
      QUnit.equal(listener.numEmitters(), 0,
          'listener.destroy() unregisters all emitters');
      QUnit.equal(emitter2.numListeners(), 0,
          'listener.destroy() unregisters the listener from all emitters');
    });
  };
});
