/**
 * Model class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import PropertyModel from '../propertymodel.js'
test('PropertyModel', () => {
  let prop, ref
  prop = new PropertyModel()
  expect(prop !== undefined, 'empty initialization is allowed').toBeTruthy()
  expect(prop.getProperty('someprop'), 'access to undefined keys returns undefined').toBe(undefined)
  const listener = {
    success: false,
    onupdate: function () {
      this.success = true
    },
    emitters: []
  }
  prop.registerListener(listener)
  expect(prop.setProperty('name', 'Some Name'), 'setProperty() returns true').toBe(true)
  expect(listener.success, 'setProperty() emits update event').toBe(true)
  expect(prop.getProperty('name'), 'setProperty() actually stores values').toBe('Some Name')
  listener.success = false
  expect(prop.setProperty('name', 'Another Name'), 'setProperty() returns true').toBe(true)
  expect(listener.success, 'setProperty() emits update event').toBe(true)
  expect(prop.getProperty('name'), 'setProperty() actually changes values').toBe('Another Name')
  listener.success = false
  expect(
    prop.setProperty('name', 'Another Name'),
    'setProperty() returns false on no-change'
  ).toBe(false)
  expect(listener.success, 'setProperty() emits no update on no-change').toBe(false)
  expect(prop.getProperty('name'), 'setProperty() did not change any values').toBe('Another Name')
  ref = {
    asd: 'dsa',
    i: 5
  }
  expect(prop.setProperty('object', ref), 'cannot store objects').toBe(false)
  expect(prop.getProperty('object'), 'object references are not stored').toBe(undefined)
  expect(prop.setProperty('array', [1, 2, 3]), 'cannot store arrays').toBe(false)
  expect(prop.getProperty('array'), 'array object references are not stored').toBe(undefined)
  ref = function () {
    //
  }
  expect(prop.setProperty('function', ref), 'cannot store functions').toBe(false)
  expect(prop.getProperty('function'), 'function references are not stored').toBe(undefined)
  expect(prop.setProperty('date', new Date()), 'cannot store dates').toBe(false)
  expect(prop.getProperty('date'), 'dates are not stored').toBe(undefined)
  expect(prop.setProperty('regex', /dsa/), 'cannot store regular expressions').toBe(false)
  expect(prop.getProperty('regex'), 'regular expressions are not stored').toBe(undefined)

  /*
   * save()/restore()
   */
  prop = new PropertyModel()
  prop.setProperty('string', 'somevalue')
  prop.setProperty('int', 53241)
  prop.setProperty('float', 53.241)
  prop.setProperty('boolean', true)
  const savedata = prop.save()
  expect(savedata, 'save() works').toBeTruthy()
  prop = new PropertyModel()
  expect(prop.restore(savedata), 'restore() works!').toBe(true)
  expect(prop.getProperty('string'), 'string restored').toBe('somevalue')
  expect(prop.getProperty('int'), 'int restored').toBe(53241)
  expect(prop.getProperty('float'), 'float restored').toBe(53.241)
  expect(prop.getProperty('boolean'), 'boolean restored').toBe(true)
  prop = new PropertyModel({
    bool: true,
    str: 'string',
    num: 123
  })
  expect(prop, 'property model with default initialization').toBeTruthy()
  expect(prop.getProperty('bool'), 'default bool property').toBe(true)
  expect(prop.getProperty('str'), 'default str property').toBe('string')
  expect(prop.getProperty('num'), 'default num property').toBe(123)
})
