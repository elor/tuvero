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
import { test, expect } from 'vitest';

import MatrixModel from '../matrixmodel.js';
import TriangleMatrixModel from '../trianglematrixmodel.js';
import extend from '../../lib/extend.js';
test('TriangleMatrixModel', () => {
  // constructor validation
  let a;
  expect(
   extend.isSubclass(TriangleMatrixModel, MatrixModel),
   'TriangleMatrixModel is subclass of MatrixModel'
  ).toBeTruthy();
  a = new TriangleMatrixModel(5);
  expect(a.length, 'length at initialization is accepted').toBe(5);
  expect(
   a.set(0, 4, 5),
   'set() above the main diagonal aborts, leaving the value at 0'
  ).toBe(undefined);
  expect(a.get(0, 4), 'get() confirms the zero-value').toBe(0);
  expect(a.set(2, 2, 5), 'set() on the main diagonal works').toBe(a);
  expect(a.get(2, 2), 'get() confirms the main diagonal value').toBe(5);
  expect(a.set(4, 3, 3), 'set() below main diagonal works').toBe(a);
  expect(a.get(4, 3), 'get() confirms the value').toBe(3);
});