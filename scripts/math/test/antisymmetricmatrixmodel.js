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

import MatrixModel from '../matrixmodel.js'
import AntisymmetricMatrixModel from '../antisymmetricmatrixmodel.js'
test('AntisymmetricMatrixModel', () => {
  // constructor validation
    expect(
    AntisymmetricMatrixModel.prototype instanceof MatrixModel,
    'AntisymmetricMatrixModel is subclass of MatrixModel'
  ).toBeTruthy()
  const a = new AntisymmetricMatrixModel(5)
  expect(a.length, 'length at initialization is accepted').toBe(5)
  expect(a.set(0, 4, 5), 'set() above the main diagonal works').toBe(a)
  expect(a.get(0, 4), 'get() confirms the written value').toBe(5)
  expect(a.get(4, 0), 'get() confirms the antisymmetric mapping').toBe(-5)
  expect(a.set(2, 2, 5), 'set() on the main diagonal works').toBe(a)
  expect(a.get(2, 2), 'get() confirms the main diagonal value').toBe(5)
  expect(a.set(4, 3, 3), 'set() below main diagonal works').toBe(a)
  expect(a.get(4, 3), 'get() confirms the value').toBe(3)
  expect(a.get(3, 4), 'get() confirms the antisymmetric value').toBe(-3)
})
