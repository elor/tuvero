/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import ListModel from '../listmodel.js'
import LengthModel from '../lengthmodel.js'
import ValueModel from '../../core/valuemodel.js'
test('LengthModel', () => {
  let length, list, success
  expect(
    LengthModel.prototype instanceof ValueModel,
    'LengthModel is subclass of ValueModel'
  ).toBeTruthy()
  success = false
  try {
    success = !new LengthModel()
  } catch (e) {
    success = true
  }
  expect(success, 'empty construction fails').toBeTruthy()
  list = new ListModel([1, 2, 3])
  length = new LengthModel(list)
  expect(length.get(), 'constructor reads the initial length of the list').toBe(3)
  list.pop()
  expect(length.get(), 'list.pop() is mirrored').toBe(2)
  list.push('asd')
  expect(length.get(), 'list.push() is mirrored').toBe(3)
  list.clear()
  expect(length.get(), 'list.clear() is mirrored').toBe(0)
})
