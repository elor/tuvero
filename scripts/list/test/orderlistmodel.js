/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import OrderListModel from '../orderlistmodel.js'
import ListModel from '../listmodel.js'
test('OrderListModel', () => {
  let list, ref
  expect(
    OrderListModel.prototype instanceof ListModel,
    'OrderListModel is subclass of ListModel'
  ).toBeTruthy()
  list = new OrderListModel()
  expect(list.length, 'initial length is 0').toBe(0)
  expect(list.asArray(), 'initial list is empty').toEqual([])
  ref = [4, 3, 1, 0, 2]
  list.enforceOrder(ref)
  expect(list.length, 'length gets adjusted automatically').toBe(5)
  expect(list.asArray(), 'elements get ordered properly').toEqual(ref)
  ref = [6, 3, 1, 5, 7, 2, 0, 4]
  list.enforceOrder(ref)
  expect(list.length, 'length gets adjusted automatically').toBe(8)
  expect(list.asArray(), 'elements get ordered properly').toEqual(ref)
  ref = []
  list.enforceOrder(ref)
  expect(list.length, 'length gets reduced automatically').toBe(0)
  expect(list.asArray(), 'elements get removed properly').toEqual(ref)
})
