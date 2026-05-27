/**
 * Unit tests for IndexedListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import IndexedListModel from '../indexedlistmodel.js'
import ListModel from '../listmodel.js'
import IndexedModel from '../indexedmodel.js'
test('IndexedListModel', () => {
  let list
  expect(
    IndexedListModel.prototype instanceof ListModel,
    'IndexedListModel is subclass of ListModel'
  ).toBeTruthy()
  list = new IndexedListModel()
  list.push(new IndexedModel())
  list.push(new IndexedModel())
  list.push(new IndexedModel())
  expect(list.get(0).getID(), 'push into empty indexed list sets the proper id').toBe(0)
  expect(list.get(1).getID(), 'push into empty indexed list sets the proper id').toBe(1)
  expect(list.get(2).getID(), 'push into empty indexed list sets the proper id').toBe(2)
  list.pop()
  expect(list.get(0).getID(), 'pop does not affect any indices').toBe(0)
  expect(list.get(1).getID(), 'pop does not affect any indices').toBe(1)
  list.push(new IndexedModel())
  list.push(new IndexedModel())
  list.remove(0)
  expect(list.get(0).getID(), 'remove(0) adjusts all following indices').toBe(0)
  expect(list.get(1).getID(), 'remove(0) adjusts all following indices').toBe(1)
  expect(list.get(2).getID(), 'remove(0) adjusts all following indices').toBe(2)
  list.remove(1)
  expect(list.get(0).getID(), 'remove(1) adjusts all following indices').toBe(0)
  expect(list.get(1).getID(), 'remove(2) adjusts all following indices').toBe(1)
  list.clear()
  expect(list.length, 'clearing a non-empty list does not throw').toBe(0)
  list = new IndexedListModel()
  list.clear()
  expect(list.length, 'clearing an empty list does not throw').toBe(0)
})
