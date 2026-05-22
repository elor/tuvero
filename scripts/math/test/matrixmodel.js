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
import VectorModel from '../vectormodel.js';
test('MatrixModel', () => {
  // constructor validation
  let a, v, v2, ref, savedata;
  a = new MatrixModel();
  expect(a.length, 'empty size initialization').toBe(0);
  expect(a.get(0, 0), 'get(0,0): out of bounds').toBe(undefined);
  a = new MatrixModel(5);
  expect(a.length, 'prefixed size initialization').toBe(5);
  expect(a.get(0, 0), 'get(0,0) === 0 on size-initialized array').toBe(0);
  expect(a.get(-1, 1), 'get(-1,1): out of bounds').toBe(undefined);
  expect(a.get(1, -1), 'get(1,-1): out of bounds').toBe(undefined);
  expect(a.get(1, 5), 'get(1,5): out of bounds').toBe(undefined);
  expect(a.get(5, 1), 'get(5,1): out of bounds').toBe(undefined);

  // extend
  a.resize();
  expect(a.length, 'resize() aborts on missing argument').toBe(5);
  a.resize(3);
  expect(a.length, 'resize() can shrink the array').toBe(3);
  a.resize(10);
  expect(a.length, 'resize() can extend the array').toBe(10);
  expect(a.set(11, 5, 3), 'set() out of bounds returns undefined').toBe(undefined);
  expect(a.set(4, 5, 3), 'set() inside bounds returns this').toBe(a);
  expect(a.get(4, 5), 'get() returns the set value').toBe(3);
  a.resize(6);
  expect(a.get(4, 5), 'get() returns the set value after resize (still in bounds)').toBe(3);
  a.resize(5);
  expect(a.get(4, 5), 'get() returns the set value (now out of bounds)').toBe(undefined);
  expect(a.set(0, 0, 5), 'set at 0,0 is a valid operation').toBe(a);
  expect(a.get(0, 0), 'set(0,0,...) actually sets the value').toBe(5);
  expect(a.set(0, 0, 0), 'set(0,0,0) does not abort').toBe(a);
  expect(a.get(0, 0), 'get(0,0) after setting to 0 does not return undefined').toBe(0);
  expect(a.set(1, 2, 3), 'set(1,2) does not abort').toBe(a);
  expect(a.get(1, 2), 'get(1,2) is valid before remove()').toBe(3);
  expect(a.remove(2), 'remove returns this').toBe(a);
  expect(a.length, 'remove reduces the size of the matrix').toBe(4);
  expect(
    a.get(1, 2),
    'get(1,2) after remove() now points to another element; returns 0'
  ).toBe(0);
  a = new MatrixModel(5);
  [0, 1, 2, 3, 4].map(function (row) {
    [0, 1, 2, 3, 4].map(function (col) {
      a.set(row, col, row * a.length + col);
    });
  });
  v = new VectorModel();
  ref = [0, 6, 12, 18, 24];
  expect(a.diagonal(v), 'diagonal() returns the vector').toBe(v);
  expect(v.length, 'diagonal() resizes the vector').toBe(5);
  expect(v.asArray(), 'diagonal has really been extracted').toEqual(ref);
  v2 = new VectorModel();
  v2.push(1);
  v2.push(2);
  v2.push(3);
  v2.push(4);
  v2.push(5);
  v.resize(0);
  ref = [40, 115, 190, 265, 340];
  expect(a.multVector(v, v2), 'multVector() finished properly').toBe(v);
  expect(v.length, 'multVector resizes the output vector').toBe(5);
  expect(v.asArray(), 'multVector performs flawlessly').toEqual(ref);
  v.resize(0);
  ref = [200, 215, 230, 245, 260];
  expect(a.vectorMult(v, v2), 'vectorMult() finished properly').toBe(v);
  expect(v.length, 'vectorMult resizes the output vector').toBe(5);
  expect(v.asArray(), 'vectorMult performs flawlessly').toEqual(ref);
  a = new MatrixModel(2);
  a.set(0, 0, 1);
  a.set(0, 1, 2);
  a.set(1, 0, 3);
  a.set(1, 1, 4);
  a.fill();
  expect(a.get(0, 0), 'fill() sets to 0').toBe(0);
  expect(a.get(0, 1), 'fill() sets to 0').toBe(0);
  expect(a.get(1, 0), 'fill() sets to 0').toBe(0);
  expect(a.get(1, 1), 'fill() sets to 0').toBe(0);
  a.fill(5);
  expect(a.get(0, 0), 'fill(5) sets to 5').toBe(5);
  expect(a.get(0, 1), 'fill(5) sets to 5').toBe(5);
  expect(a.get(1, 0), 'fill(5) sets to 5').toBe(5);
  expect(a.get(1, 1), 'fill(5) sets to 5').toBe(5);
  a = new MatrixModel(5);
  a.set(1, 2, 3);
  a.set(0, 0, 5);
  a.set(0, 4, -1);
  a.set(4, 1, 3);
  a.set(4, 4, 123);
  savedata = a.save();
  expect(savedata, 'save() works').toBeTruthy();
  a = new MatrixModel(12345);
  expect(a.restore(savedata), 'restore() works').toBeTruthy();
  expect(a.length, 'restore() restored the length').toBe(5);
  expect(a.get(1, 2), 'restore() restored individual numbers').toBe(3);
  expect(a.get(0, 0), 'restore() restored individual numbers').toBe(5);
  expect(a.get(0, 4), 'restore() restored individual numbers').toBe(-1);
  expect(a.get(4, 1), 'restore() restored individual numbers').toBe(3);
  expect(a.get(4, 4), 'restore() restored individual numbers').toBe(123);
  a = new MatrixModel(3);
  savedata = a.save();
  expect(savedata, 'save() with empty matrix').toBeTruthy();
  a = new MatrixModel(7);
  expect(a.restore(savedata), 'restore() of an empty matrix').toBeTruthy();
  expect(a.length, 'restore(0 restored the length').toBe(3);
});