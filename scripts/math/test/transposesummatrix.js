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

import TransposeSumMatrix from '../transposesummatrix.js'
import DelegateMatrix from '../delegatematrix.js'
import MatrixModel from '../matrixmodel.js'
test('TransposeSumMatrix', () => {
  // constructor validation
    expect(
    TransposeSumMatrix.prototype instanceof DelegateMatrix,
    'TransposeSumMatrix is a DelegateMatrix subclass'
  ).toBeTruthy()
  const m = new MatrixModel(5)
  const a = new TransposeSumMatrix(m);
  [0, 1, 2, 3, 4].forEach(function (row) {
    [0, 1, 2, 3, 4].forEach(function (col) {
      m.set(row, col, 12 - (row * a.length + col))
    })
  })
  expect(a.get(0, 0), 'get() on diagonal returns a twice value').toBe(24)
  expect(a.get(3, 2), 'get() returns the transpose-sum').toBe(-6)
  expect(a.get(1, 0), 'get() returns the transpose-sum').toBe(18)
  expect(a.get(2, 2), 'get() returns the transpose-sum').toBe(0)
  expect(a.get(4, 4), 'get() returns the transpose-sum').toBe(-24)
  expect(a.get(-1, 2), 'get() out of bounds (row low)').toBe(undefined)
  expect(a.get(2, -9), 'get() out of bounds (col low)').toBe(undefined)
  expect(a.get(5, 3), 'get() out of bounds (row high)').toBe(undefined)
  expect(a.get(3, 7531), 'get() out of bounds (col high)').toBe(undefined)
})
