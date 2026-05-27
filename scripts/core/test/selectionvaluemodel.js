/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import SelectionValueModel from '../selectionvaluemodel.js'
import ListModel from '../../list/listmodel.js'
test('SelectionValueModel', () => {
  let model, allowed, defaultvalue
  defaultvalue = 123
  allowed = new ListModel()
  model = new SelectionValueModel(defaultvalue, allowed)
  expect(model.get(), 'defaultvalue respected').toBe(defaultvalue)
  expect(model.set(321), 'unallowed value').toBe(false)
  expect(model.set(5), 'unallowed value').toBe(false)
  expect(model.set('asd'), 'unallowed value').toBe(false)
  expect(model.get(), 'empty allowed-list').toBe(defaultvalue)
  allowed.push(5)
  expect(model.set(5), 'allowed value').toBe(true)
  expect(model.set(5), 'allowed value, again').toBe(true)
  expect(model.get(), 'setting allowed value').toBe(5)
  allowed.push(4)
  allowed.push(3)
  allowed.push(2)
  allowed.push(1)
  allowed.push(10)
  allowed.push(551)
  expect(model.get(), 'retaining value on allowedlist-extension').toBe(5)
  expect(model.set(10), 'allowed value').toBe(true)
  expect(model.get(), 'changing allowed value').toBe(10)
  allowed.remove(allowed.indexOf(10))
  expect(model.get(), 'value reverts to defaultValue').toBe(defaultvalue)
  model.setDefault(321)
  expect(model.get(), 'default value changed, was not allowed').toBe(321)
})
