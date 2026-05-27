/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import ValueModel from '../../core/valuemodel.js'
import ListModel from '../../list/listmodel.js'
import ListCollectorModel from '../listcollectormodel.js'
test('ListCollectorModel', () => {
  const listener = {
    updatecount: 0,
    onupdate: function () {
      listener.updatecount += 1
    },
    emitters: []
  }
  const list = new ListModel()
  const model = new ListCollectorModel(list, ValueModel)
  model.registerListener(listener)
  expect(model.emitters.length, 'starting without any emitters').toBe(0)
  list.push(new ValueModel())
  expect(model.emitters.length, 'automatically adding emitters').toBe(1)
  list.get(0).set(5)
  expect(listener.updatecount, 'recieving update events from inside the list').toBe(1)
  const obj = list.pop()
  expect(
    model.emitters.length,
    'unregistering from emitters when they are removed from the list'
  ).toBe(0)
  listener.updatecount = 0
  obj.set(8)
  expect(listener.updatecount, 'removed emitters are unregistered from').toBe(0)
  list.push(obj)
  list.push(obj)
  list.push(obj)
  listener.updatecount = 0
  obj.set(13)
  expect(
    listener.updatecount,
    'events of multiply inserted emitters are re-emitted exactly once'
  ).toBe(1)
  list.pop()
  listener.updatecount = 0
  obj.set(20)
  expect(
    listener.updatecount,
    'not unregistering a multiply inserted element if removed once'
  ).toBe(1)
})
