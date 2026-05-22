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

import AbsoluteMatrix from '../absolutematrix.js';
import DelegateMatrix from '../delegatematrix.js';
import MatrixModel from '../matrixmodel.js';
import extend from '../../lib/extend.js';
test('AbsoluteMatrix', () => {
  // constructor validation
  var a, m;
  expect(
    extend.isSubclass(AbsoluteMatrix, DelegateMatrix),
    'AbsoluteMatrix is a DelegateMatrix subclass'
  ).toBeTruthy();
  m = new MatrixModel(5);
  a = new AbsoluteMatrix(m);
  [0, 1, 2, 3, 4].forEach(function (row) {
    [0, 1, 2, 3, 4].forEach(function (col) {
      m.set(row, col, 12 - (row * a.length + col));
    });
  });
  expect(a.get(0, 0), 'get() get() returns the absolute value').toBe(12);
  expect(a.get(3, 2), 'get() get() returns the absolute value').toBe(5);
  expect(a.get(1, 0), 'get() get() returns the absolute value').toBe(7);
  expect(a.get(2, 2), 'get() get() returns the absolute value').toBe(0);
  expect(a.get(4, 4), 'get() get() returns the absolute value').toBe(12);
  expect(a.get(-1, 2), 'get() out of bounds (row low)').toBe(undefined);
  expect(a.get(2, -9), 'get() out of bounds (col low)').toBe(undefined);
  expect(a.get(5, 3), 'get() out of bounds (row high)').toBe(undefined);
  expect(a.get(3, 7531), 'get() out of bounds (col high)').toBe(undefined);
});