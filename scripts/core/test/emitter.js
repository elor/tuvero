/**
 * Event Emitter tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import Emitter from '../emitter.js'
test('Emitter', () => {
  let emitter, listener, listener2, eventcounter, resetcounter, retval
  eventcounter = resetcounter = 0
  emitter = undefined
  listener = undefined
  listener = {
    /**
     * test function
     */
    onundefined: function () {
      this.onreset()
    },
    /**
     * test function
     */
    onreset: function () {
      eventcounter = 0
      resetcounter += 1
    },
    /**
     * test function
     */
    onevent: function (_emitter, event) {
      eventcounter += 1
      expect(this, 'onevent(): this equals listener').toBe(listener)
      expect(_emitter, 'onevent(): first argument equals emitter ').toBe(emitter)
      expect(event, 'onevent(): second argument equals event string').toBe('event')
    },
    emitters: []
  }
  listener2 = {
    /**
     * test function
     */
    onevent: function () {
      eventcounter += 1
    },
    emitters: []
  }
  emitter = new Emitter()
  emitter.EVENTS = {
    asd: true,
    event: true,
    reset: true
  }
  retval = emitter.emit('asd')
  expect(retval, 'Emitter: unreceived event returns false on emit()').toBe(false)
  emitter.registerListener(listener).registerListener(listener2)
  expect(
    eventcounter + resetcounter,
    'counters are at a zero state after listener registration'
  ).toBe(0)
  retval = emitter.emit('event')
  expect(eventcounter, "both listeners received 'event'").toBe(2)
  expect(retval, 'Emitter: received event returns true on emit()').toBe(true)
  emitter.registerListener(listener)
  retval = emitter.emit('event')
  expect(eventcounter, 'Cannot register an event listener twice').toBe(4)
  retval = emitter.emit('reset')
  expect(eventcounter, "counter was reset during 'reset' event").toBe(0)
  expect(resetcounter, 'reset was processed').toBe(1)
  retval = emitter.emit('event')
  retval = emitter.emit()
  expect(resetcounter, 'default event (undefined) was not processed').toBe(1)
  expect(eventcounter, 'onundefined callback function was not processed').toBe(2)
  emitter.emit('thisEventIsInvalid')
  expect(eventcounter, 'unspecified events are not processed').toBe(2)
  emitter.unregisterListener(listener)
  retval = emitter.emit('event')
  expect(eventcounter, 'unregistered listeners do not receive events').toBe(3)
  retval = emitter.listeners.indexOf(listener)
  expect(retval, 'listeners are removed from emitter.listeners').toBe(-1)
  retval = listener.emitters.indexOf(emitter)
  expect(retval, 'emitters are removed from listener.emitters').toBe(-1)

  /*
   * emit+unregister test
   *
   * When unregistering a listener from a currently emitting emitter, the
   * listeners array is manipulated, possibly causing listeners to be
   * skipped. This is an error, which should be fixed
   */

  emitter = new Emitter()
  emitter.EVENTS = {
    evt: true
  }
  listener2 = {
    success: false,
    onevt: function () {
      this.success = true
    },
    emitters: []
  }
  listener = {
    onevt: function () {
      emitter.unregisterListener(this)
    },
    emitters: []
  }
  emitter.registerListener(listener)
  emitter.registerListener(listener2)
  emitter.emit('evt')
  expect(
    listener2.success,
    'unregister during emit should not cause listeners to be skipped'
  ).toBe(true)

  /*
   * testing memory leak due to invalid forEach call
   */
  emitter = new Emitter()
  listener = {
    emitters: []
  }
  listener2 = {
    emitters: []
  }
  emitter.registerListener(listener)
  emitter.registerListener(listener2)
  emitter.destroy()
  expect(listener.emitters.length, 'memleak: first listener was unregistered').toBe(0)
  expect(listener2.emitters.length, 'memleak: second listener was unregistered').toBe(0)

  /*
   * Test Exception handling
   */

  emitter = new Emitter()
  emitter.EVENTS = {
    evt: true
  }
  eventcounter = 0
  listener = {
    onevt: function () {
      throw Error('Planned failure.')
    },
    emitters: []
  }
  listener2 = {
    onevt: function () {
      eventcounter += 1
    },
    emitters: []
  }
  emitter.registerListener(listener)
  emitter.registerListener(listener2)
  emitter.emit('evt')
  emitter.emit('evt')
  expect(eventcounter, 'errors are intercepted').toBe(2)
})
