/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
/*
 * Various Matrix Tests
 */
import { test, expect } from 'vitest'

import TransposeDifferenceMatrix from '../transposedifferencematrix.js'
import DelegateMatrix from '../delegatematrix.js'
import MatrixModel from '../matrixmodel.js'
test('TransposeDifferenceMatrix', () => {
  // constructor validation
  expect(
    TransposeDifferenceMatrix.prototype instanceof DelegateMatrix,
    'TransposeDifferenceMatrix is a DelegateMatrix subclass'
  ).toBeTruthy()
  const m = new MatrixModel(5)
  const a = new TransposeDifferenceMatrix(m);
  [0, 1, 2, 3, 4].forEach(function (row) {
    [0, 1, 2, 3, 4].forEach(function (col) {
      m.set(row, col, 12 - (row * a.length + col))
    })
  })
  expect(a.get(0, 0), 'get() on diagonal returns 0').toBe(0)
  expect(a.get(3, 2), 'get() returns the transpose-difference').toBe(-4)
  expect(a.get(0, 1), 'get() returns the transpose-difference').toBe(4)
  expect(a.get(2, 2), 'get() on diagonal returns 0').toBe(0)
  expect(a.get(4, 0), 'get() returns the transpose-difference').toBe(-16)
  expect(a.get(0, 4), 'get() is antisymmetric').toBe(16)
  expect(a.get(-1, 2), 'get() out of bounds (row low)').toBe(undefined)
  expect(a.get(2, -9), 'get() out of bounds (col low)').toBe(undefined)
  expect(a.get(5, 3), 'get() out of bounds (row high)').toBe(undefined)
  expect(a.get(3, 7531), 'get() out of bounds (col high)').toBe(undefined)
})
