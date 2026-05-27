/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import BinningReferenceListModel from '../binningreferencelistmodel.js'
import ListModel from '../listmodel.js'
test('BinningReferenceListModel', () => {
  let success, binlist, list
  expect(
    BinningReferenceListModel.prototype instanceof ListModel,
    'BinningReferenceListModel is subclass of ListModel'
  ).toBeTruthy()
  success = false
  try {
    binlist = new BinningReferenceListModel()
  } catch (e) {
    success = true
  }
  expect(success, 'empty construction throws an error').toBeTruthy()
  success = false
  list = new ListModel()
  try {
    binlist = new BinningReferenceListModel(list)
  } catch (e) {
    success = true
  }
  expect(success, 'missing binning function throws an error').toBeTruthy()
  success = false
  const binningFunction = function (num) {
    return num % 10
  }
  try {
    binlist = new BinningReferenceListModel(undefined)
  } catch (e) {
    success = true
  }
  expect(success, 'missing bin list throws an error').toBeTruthy()
  binlist = new BinningReferenceListModel(list, binningFunction)
  expect(binlist, 'proper construction').toBeTruthy()
  expect(binlist.length, 'initial length is 0').toBe(0)
  list.push(4)
  expect(binlist.length, "there's one bin now").toBe(1)
  expect(binlist.getBinName(0), 'bin has correct name').toBe(4)
  const bin = binlist.getBin(4)
  expect(bin.length, 'bin contains an element').toBe(1)
  expect(bin.asArray(), 'bin 4 contains the number 4').toEqual([4])
  list.push(14)
  expect(binlist.length, "there's still only one bin").toBe(1)
  expect(bin.asArray(), 'bin 4 contains the number 14').toEqual([4, 14])
  list.insert(0, 24)
  expect(bin.asArray(), 'order of original list is preserved').toEqual([24, 4, 14])
  list.push(1)
  list.push(12)
  list.push(53)
  expect(binlist.length, 'More insertions: 4 bins').toBe(4)
  list.pop()
  expect(binlist.length, 'only 3 bins after the removal of a unique number').toBe(3)
  list = new ListModel([4, 1, 2, 53, 16, 5, 8, 9, 0, 7])
  binlist = new BinningReferenceListModel(list, binningFunction)
  expect(binlist.length, 'auto-initialization from existing values').toBe(10)
  expect(binlist.getBin(3).get(0), 'binlist contains actual values, not indices').toBe(53)
})
