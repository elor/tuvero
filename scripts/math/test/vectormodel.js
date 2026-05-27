/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import ListModel from '../../list/listmodel.js'
import VectorModel from '../vectormodel.js'
test('VectorModel', () => {
  let vec, vec2, ref, success, data
  expect(
    VectorModel.prototype instanceof ListModel,
    'VectorModel is subclass of ListModel'
  ).toBeTruthy()
  vec = new VectorModel()
  expect(vec.length, 'empty initialization: length is 0').toBe(0)
  vec.resize(123)
  expect(vec.length, 'resize() expands to the wanted length').toBe(123)
  expect(vec.get(0), 'resize() fills with 0 (beg)').toBe(0)
  expect(vec.get(55), 'resize() fills with 0 (mid)').toBe(0)
  expect(vec.get(122), 'resize() fills with 0 (end)').toBe(0)
  vec.resize(5)
  expect(vec.length, 'resize() crops to the wanted length').toBe(5)
  expect(vec.get(122), 'get() reads removed elements as undefined').toBe(undefined)
  vec.resize(-5)
  expect(vec.length, 'resize() to negative number crops to length 0').toBe(0)
  vec = new VectorModel(10)
  vec.push(1)
  vec.push(2)
  vec.push(3)
  vec.push(4)
  vec.push(5)
  vec.push(6)
  vec.push(7)
  vec.push(8)
  const retvec = new VectorModel()
  vec2 = new VectorModel(vec.length)
  vec2.forEach(function (elem, index) {
    vec2.set(index, index)
  })
  expect(retvec.mult(vec, vec2), 'mult does not fail').toBe(retvec)
  expect(retvec.length, 'mult resizes target').toBe(18)
  ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 22, 36, 52, 70, 90, 112, 136]
  expect(retvec.asArray(), 'mult calculates the vector product').toEqual(ref)
  expect(retvec.mult(vec), 'mult with one argument').toBe(retvec)
  ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 44, 108, 208, 350, 540, 784, 1088]
  expect(retvec.asArray(), 'mult calculates the vector product').toEqual(ref)
  expect(vec.dot(vec2), 'dot() calculates the dot product').toBe(528)
  retvec.resize(0)
  expect(retvec.sum(vec, vec2), 'sum() returns the vector').toBe(retvec)
  expect(retvec.length, 'sum() resizes the target vector').toBe(18)
  ref = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25]
  expect(retvec.asArray(), 'sum calculates the element sum').toEqual(ref)

  // resize, so ref does not exceed the line length. This is pretty
  // stupid,
  // but this is not a stress test anyhow.
  vec2.resize(15)
  retvec.resize(15)
  expect(retvec.sum(vec2), 'sum() returns the vector').toBe(retvec)
  ref = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33]
  expect(retvec.asArray(), 'sum calculates element sum').toEqual(ref)
  retvec.fill()
  ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  expect(retvec.asArray(), 'fill() resets the contents').toEqual(ref)
  retvec.fill(5)
  ref = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  expect(retvec.asArray(), 'fill(5) sets the contents').toEqual(ref)
  vec = new VectorModel(5)
  vec.set(0, 5)
  vec.set(1, 4)
  vec.set(2, 3)
  vec.set(3, 2)
  vec.set(4, 1)
  success = false
  try {
    vec2.mult(vec, 5)
  } catch (e) {
    success = true
  }
  expect(success, 'mult(VectorModel, Number) aborts as intended').toBeTruthy()
  success = true
  try {
    vec2.mult(5, vec)
  } catch (e2) {
    success = false
  }
  expect(success, 'mult(Number, VectorModel) aborts as intended').toBeTruthy()
  ref = [25, 20, 15, 10, 5]
  expect(vec2.asArray(), 'mult(Number) works properly').toEqual(ref)
  success = true
  try {
    vec.mult(5)
  } catch (e) {
    success = false
  }
  expect(success, 'mult(Number, VectorModel) aborts as intended').toBeTruthy()
  ref = [25, 20, 15, 10, 5]
  expect(vec.asArray(), 'mult(Number) works properly').toEqual(ref)

  /*
   * save()/restore()
   */

  vec = new VectorModel()
  vec2 = new VectorModel(15)
  vec.push(5)
  vec.push(3)
  vec.push(4)
  vec.push(1)
  vec.push(2)
  data = vec.save()
  expect(data, 'save() does seem to work').toBeTruthy()
  expect(vec2.restore(data), 'restore() works').toBe(true)
  expect(vec2.asArray(), 'restored values are correct').toEqual([5, 3, 4, 1, 2])
  vec = new VectorModel()
  vec.push(0)
  vec.push(0)
  vec.push(1)
  vec.push(0)
  vec.push(0)
  data = vec.save()
  vec = new VectorModel()
  vec.restore(data)
  expect(vec.asArray(), 'no undefined values in the array').toEqual([0, 0, 1, 0, 0])
})
