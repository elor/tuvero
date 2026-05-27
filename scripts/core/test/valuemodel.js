/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import ValueModel from '../valuemodel.js'
test('ValueModel', () => {
  let model, obj
  const listener = {
    lastdata: undefined,
    updatecount: 0,
    onupdate: function (emitter, event, data) {
      listener.updatecount += 1
      listener.lastdata = data
    },
    emitters: []
  }
  model = new ValueModel()
  expect(model.get(), 'default value: undefined').toBe(undefined)
  model = new ValueModel(5)
  expect(model.get(), 'accepting numeric default values').toBe(5)
  model = new ValueModel(0)
  expect(model.get(), 'accepting 0 as a default value').toBe(0)
  model.registerListener(listener)
  model.set(12345)
  expect(model.get(), 'set() sets a new value').toBe(12345)
  expect(listener.updatecount, 'set() fires an update event').toBe(1)
  model.set(12345)
  expect(model.get(), 'set() retains the old value').toBe(12345)
  expect(listener.updatecount, 'set() does not update if values match').toBe(1)
  model.set('12345')
  expect(model.get(), 'set() updates on type mismatch').toBe('12345')
  expect(listener.updatecount, 'set() type mismatch: fire update').toBe(2)
  obj = {}
  model.set(obj)
  expect(model.get(), 'set(): objects are referenced directly').toBe(obj)
  const model2 = new ValueModel()
  model = new ValueModel()
  model.bind(model2)
  model2.set(5)
  expect(model.get(), 'bind(): works with numbers').toBe(5)
  obj = {}
  model2.set(obj)
  expect(model.get(), 'bind(): works with object references').toBe(obj)
  model2.bind(model)
  model.set(11)
  expect(model.get(), 'cyclic bind(): model A').toBe(11)
  expect(model2.get(), 'cyclic bind(): model B').toBe(11)
})
