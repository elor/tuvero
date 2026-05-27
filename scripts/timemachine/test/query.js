/**
 * Unit tests for Query
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import Query from '../query.js'
import KeyModel from '../keymodel.js'
import Type from '../../core/type.js'
import Presets from 'presets'
let localStorage
try {
  localStorage = window.localStorage
} catch (e) {
  localStorage = {
    setItem: function (key, value) {
      this[key] = value
    },
    removeItem: function (key) {
      delete this[key]
    }
  }
}
Query.source = localStorage
test('Query', () => {
  let query, key, key2, key3, key4, ref
  query = new Query(Query.ALLKEYS)
  expect(query, 'ALLKEYS construction successful').toBeTruthy()
  expect(Type.isArray(query.filter()), 'filter() result is an array').toBeTruthy()
  query.filter().forEach(function (key) {
    const match = new RegExp('^' + Presets.target + '_').test(key)
    expect(match, 'saved key matches target: ' + key).toBe(true)
    if (match) {
      if (localStorage) {
        localStorage.removeItem(key)
      }
    }
  })
  expect(query.filter(), 'ALL-query on cleared localStorage returns no results').toEqual([])
  ref = Presets.target + '_2016-02-12T12:10:11.591Z_2016-02-12T12:10:11.591Z'
  key = KeyModel.fromString(ref)
  key2 = KeyModel.createChild(key)
  ref = Presets.target + '_2015-06-01T19:55:12.512Z_2015-06-01T19:55:12.512Z'
  key3 = KeyModel.fromString(ref)
  ref = Presets.target + '_2015-06-01T19:55:12.512Z_2345-10-01T20:55:12.512Z'
  key4 = KeyModel.fromString(ref)
  if (localStorage) {
    localStorage.setItem(key, 'test')
    localStorage.setItem(key2, 'test')
    localStorage.setItem(key3, 'test')
    localStorage.setItem(key4, 'test')
  }
  ref = [key.toString(), key2.toString(), key3.toString(), key4.toString()].sort()
  expect(query.filter(), 'ALLKEYS returns all 4 test keys').toEqual(ref)
  ref = [key.toString(), key3.toString()].sort()
  query = new Query(Query.ROOTKEYS)
  expect(query, 'ROOTKEYS construction successful').toBeTruthy()
  expect(query.filter(), 'ROOTKEYS finds both init keys').toEqual(ref)
  query = new Query(Query.LASTKEYS)
  expect(query, 'LASTKEYS construction successful').toBeTruthy()
  ref = [key2.toString(), key4.toString()].sort()
  expect(query.filter(), 'LASTKEYS finds both last saves').toEqual(ref)
  query = new Query(Query.LATESTSAVE)
  expect(query, 'LATESTKEYS construction successful').toBeTruthy()
  ref = [key4.toString()].sort()
  expect(query.filter(), 'LATESTSAVE finds the latest save').toEqual(ref)
  ref = [key.toString(), key2.toString()].sort()
  query = new Query(key)
  expect(query, 'construction from key successful').toBeTruthy()
  expect(query.filter(), 'successful related-keys query 1').toEqual(ref)
  query = new Query(key2)
  expect(query, 'construction from key2 successful').toBeTruthy()
  expect(query.filter(), 'successful related-keys query 2').toEqual(ref)
  ref = [key3.toString(), key4.toString()].sort()
  query = new Query(key3)
  expect(query, 'construction from key3 successful').toBeTruthy()
  expect(query.filter(), 'successful related-keys query 3').toEqual(ref)
  query = new Query(key4)
  expect(query, 'construction from key4 successful').toBeTruthy()
  expect(query.filter(), 'successful related-keys query 4').toEqual(ref)

  /*
   * cleanup
   */

  if (localStorage) {
    localStorage.removeItem(key)
    localStorage.removeItem(key2)
    localStorage.removeItem(key3)
    localStorage.removeItem(key4)
  }
  expect(
    new Query(undefined).filter(),
    'ALL-query on post-test cleared localStorage returns no results'
  ).toEqual([])
})
