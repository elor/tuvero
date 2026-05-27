/**
 * Unit tests for KeyModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import KeyModel from '../keymodel.js'
import Model from '../../core/model.js'
import Presets from 'presets'
test('KeyModel', () => {
  let key, key2, ref, date
  expect(KeyModel.prototype instanceof Model, 'KeyModel is subclass of Model').toBeTruthy()

  /*
   * init-key
   */

  key = KeyModel.createRoot()
  expect(key, 'empty initialization works (init-key)').toBeTruthy()
  expect(key.toString(), 'init-key serialization works').toBeTruthy()
  expect(key.startDate, 'init-key startDate is set').toBeTruthy()
  expect(key.saveDate, 'init-key saveDate is set').toBeTruthy()
  expect(key.startDate, 'init-key dates match').toBe(key.saveDate)
  expect(key.target, 'init-key target matches').toBe(Presets.target)
  expect(KeyModel.isValidKey(key.toString()), 'serialized init-key is a valid key').toBe(true)
  expect(key.isRoot(), 'init-key is an init key').toBe(true)
  expect(key.isRelated(key), 'init-key is actually related to itself').toBe(true)
  expect(key.isRelated(key.toString()), 'key string is related to itself').toBe(true)
  expect(key.isEqual(key), 'key is equal to itself').toBe(true)
  expect(key.isEqual(key.toString()), 'key string is equal to itself').toBe(true)
  date = new Date(key.startDate)
  expect(date, 'startDate can be converted to an instance of Date').toBeTruthy()
  expect(date.toISOString(), 'Date conversion is fully reversible').toBe(key.startDate)

  /*
   * save-keys
   */

  key2 = KeyModel.createChild(key)
  expect(key2, 'reference initialization works (save-key)').toBeTruthy()
  expect(key2.toString(), 'save-key serialization works').toBeTruthy()
  expect(key2.startDate, 'save-key startDate is set').toBeTruthy()
  expect(key2.saveDate, 'save-key saveDate is set').toBeTruthy()
  expect(key2.target, 'save-key target matches current target').toBe(Presets.target)
  expect(key2.startDate, 'save-key dates are not equal').not.toBe(key2.saveDate)
  expect(key2.startDate, 'both keys have the same start date').toBe(key.startDate)
  date = new Date(key.saveDate)
  expect(date, 'saveDate can be converted to an instance of Date').toBeTruthy()
  expect(date.toISOString(), 'Date conversion is fully reversible').toBe(key.saveDate)
  expect(KeyModel.isValidKey(key2), 'key2 is a valid key').toBe(true)
  expect(key2.isRoot(), 'save-key is no init key').toBe(false)
  expect(key2.isEqual(key2), 'key2 is equal to itself').toBe(true)
  expect(key2.isRelated(key2), 'key2 is related to itself').toBe(true)
  expect(key.isRelated(key2), 'key is related to key2').toBe(true)
  expect(key.isEqual(key2), 'key is not equal to key2').toBe(false)
  expect(key.isRelated(key2), 'key is related to key2').toBe(true)
  expect(key.isEqual(key2), 'key is not equal to key2').toBe(false)

  /*
   * string construction
   */

  ref = Presets.target + '_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z'
  expect(KeyModel.isValidKey(ref), 'ref is a valid key: ' + ref).toBe(true)
  key = KeyModel.fromString(ref)
  expect(key, 'string-key construction works').toBeTruthy()
  expect(key.toString(), 'data is read and reconstructed as-is').toBe(ref)
  expect(key.isEqual(ref), 'key is equal to its construction string').toBe(true)
  expect(KeyModel.isValidKey(key), 'string-constructed key is a valid key').toBe(true)
  expect(key.isRoot(), 'string-key is no init key').toBe(false)
  expect(key.isEqual(key2), 'unrelated keys are unequal').toBe(false)
  expect(key.isRelated(key2), 'unrelated keys are unrelated').toBe(false)

  /*
   * other targets
   */
  ref = 'boule_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z'
  expect(KeyModel.isTuveroKey(ref), 'cross-target key is a tuvero key: ' + ref).toBe(true)
  expect(KeyModel.isValidKey(ref), 'cross-target key is not valid: ' + ref).toBe(false)
  ref = 'tac_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z'
  expect(KeyModel.isTuveroKey(ref), 'cross-target key is a tuvero key: ' + ref).toBe(true)
  expect(KeyModel.isValidKey(ref), 'cross-target key is not valid: ' + ref).toBe(false)
  function testkey (keystring, keydescription) {
    let success = false
    key = undefined
    try {
      key = KeyModel.fromString(keystring)
    } catch (e) {
      success = true
    }
    if (key || keystring === undefined) {
      success = false
    }
    expect(success, 'forbidden key is intercepted: ' + keydescription).toBe(true)
  }
  expect(Presets.target, 'test').toBeTruthy()
  key = undefined
  testkey('', 'empty key')
  testkey('test_2016-02-11T17:36:50Z_2016-02-11T18:23:02Z', 'missing milliseconds')
  testkey('test_2016-02-11T17:36:50.012Z', 'only one date')
  testkey('test_2016-02-11T17:36:50.123_2016-02-11T18:23:02.543', 'Z missing')
  testkey('test_20160211T17:36:50.123Z_20160211T18:23:02.543Z', 'date delimiters missing')
  testkey('test_2016-02-11T173650.123Z_2016-02-11T182302.543Z', 'time delimiters missing')
  testkey('test-2016-02-11T17:36:50.123Z-2016-02-11T18:23:02.543Z', 'wrong key delimiters')
  testkey('test__2016-02-11T17:36:50.123Z__2016-02-11T18:23:02.543Z', 'too many key delimiters')
  testkey('rotz_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z', 'unallowed target')
  testkey('boule_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z', 'wrong target')
  testkey('2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z', 'target missing')
  testkey('test_2016-02-11-17:36:50.123Z_2016-02-11-18:23:02.543Z', 'T missing')
  testkey('test-saves', 'key for another model')
  testkey('TEST_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z', 'wrong target case')
  testkey('test_2016-02-11T17:36:50.123z_2016-02-11T18:23:02.543z', 'Z: wrong case')
  testkey('test_2016-02-11t17:36:50.123Z_2016-02-11t18:23:02.543Z', 'T: wrong case')
})
