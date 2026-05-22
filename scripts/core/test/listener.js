/**
 * tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Emitter from '../emitter.js';
import Listener from '../listener.js';
test('Listener', () => {
  var emitter, emitter2, listener, ref;
  emitter = new Emitter();
  emitter2 = new Emitter();
  emitter2.numListeners = function () {
    return this.listeners.length;
  };
  listener = new Listener(emitter);
  listener.updatecount = 0;
  listener.onupdate = function () {
    this.updatecount += 1;
  };
  listener.numEmitters = function () {
    return this.emitters.length;
  };
  expect(listener.numEmitters(), 'listener initializes with an emitter').toBe(1);
  emitter.emit('update');
  expect(listener.updatecount, 'update event received from emitter1').toBe(1);
  emitter2.registerListener(listener);
  expect(listener.numEmitters(), 'registerListener adds emitter2').toBe(2);
  emitter2.emit('update');
  expect(listener.updatecount, 'receiving events from emitter2').toBe(2);
  emitter.unregisterListener(listener);
  expect(listener.numEmitters(), 'emitter.destroy() unregisters the listener').toBe(1);
  emitter.registerListener(listener);
  expect(listener.numEmitters(), 're-registering the emitter').toBe(2);
  emitter.destroy();
  expect(listener.numEmitters(), 'emitter.destroy() unregisters the listener').toBe(1);
  listener.destroy();
  expect(listener.numEmitters(), 'listener.destroy() unregisters all emitters').toBe(0);
  expect(
    emitter2.numListeners(),
    'listener.destroy() unregisters the listener from all emitters'
  ).toBe(0);

  /*
   * Listener.bind
   */
  emitter = new Emitter();
  ref = 0;
  Listener.bind(emitter, 'update', function () {
    ref += 1;
  });
  emitter.emit('update');
  emitter.emit('reset');
  expect(emitter, 'bind-created listener works').toBeTruthy();
  emitter.destroy();
  emitter = new Emitter();
  ref = 0;
  Listener.bind(emitter, 'update,reset', function (e, evt, data) {
    ref += data || 1;
  });
  emitter.emit('reset');
  emitter.emit('update', 123);
  expect(ref, 'bind-listening for multiple event types ' + 'with data object').toBe(124);
  emitter.destroy();
  emitter = new Emitter();
  ref = undefined;
  Listener.bind(emitter, 'reset', function () {
    ref = this;
  }, emitter);
  emitter.emit('reset');
  expect(ref, 'bind(): thisArg works').toBe(emitter);

  /*
   * testing memory leak due to invalid forEach call
   */
  emitter = new Emitter();
  emitter2 = new Emitter();
  listener = new Listener(emitter);
  emitter2.registerListener(listener);
  listener.destroy();
  expect(emitter.listeners.length, 'memleak: first emitter was unregistered').toBe(0);
  expect(emitter2.listeners.length, 'memleak: second emitter was unregistered').toBe(0);

  /**
   * double-listening test
   */
  emitter = new Emitter();
  listener = new Listener(emitter);
  emitter.registerListener(listener);
  expect(listener.emitters.length, 'double registration of a listener is prevented').toBe(1);
  listener.resetcount = 0;
  listener.onreset = function () {
    this.resetcount += 1;
  };
  emitter.emit('reset');
  expect(listener.resetcount, 'double invocation of a listener is prevented').toBe(1);
});