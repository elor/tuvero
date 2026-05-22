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

import DelegateMatrix from '../delegatematrix.js';
import MatrixModel from '../matrixmodel.js';
import extend from '../../lib/extend.js';
test('DelegateMatrix', () => {
  // constructor validation
  var a, m, state;
  expect(
    extend.isSubclass(DelegateMatrix, MatrixModel),
    'DelegateMatrix is a MatrixModel subclass'
  ).toBeTruthy();
  state = true;
  try {
    a = new DelegateMatrix();
  } catch (e) {
    state = false;
  }
  expect(state, 'empty initialization fails').toBe(false);
  state = true;
  try {
    a = new DelegateMatrix(5);
  } catch (e) {
    state = false;
  }
  expect(state, 'initialization with size fails').toBe(false);
  m = new MatrixModel(5);
  a = new DelegateMatrix(m);
  expect(a, 'proper initialization').toBeTruthy();
  state = true;
  try {
    a.set(1, 2, 3);
  } catch (e) {
    state = false;
  }
  expect(state, 'set() throws').toBe(false);
  state = true;
  try {
    a.remove(1);
  } catch (e) {
    state = false;
  }
  expect(state, 'remove() throws').toBe(false);
  state = true;
  try {
    a.resize(1);
  } catch (e) {
    state = false;
  }
  expect(state, 'resize() throws').toBe(false);
  state = true;
  try {
    a.fill(1);
  } catch (e) {
    state = false;
  }
  expect(state, 'fill() throws').toBe(false);
  [0, 1, 2, 3, 4].forEach(function (row) {
    [0, 1, 2, 3, 4].forEach(function (col) {
      m.set(row, col, 12 - (row * a.length + col));
    });
  });
  expect(a.get(0, 0), 'get() delegates to the linked matrix').toBe(12);
  expect(a.get(3, 2), 'get() delegates to the linked matrix').toBe(-5);
  expect(a.get(1, 0), 'get() delegates to the linked matrix').toBe(7);
  expect(a.get(4, 4), 'get() delegates to the linked matrix').toBe(-12);
  expect(a.get(-1, 2), 'get() out of bounds (row low)').toBe(undefined);
  expect(a.get(2, -9), 'get() out of bounds (col low)').toBe(undefined);
  expect(a.get(5, 3), 'get() out of bounds (row high)').toBe(undefined);
  expect(a.get(3, 7531), 'get() out of bounds (col high)').toBe(undefined);
});