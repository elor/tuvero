/**
 * Model class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Model from '../model.js';
import Emitter from '../emitter.js';
import extend from '../../lib/extend.js';
test('Model', () => {
  let model, success;
  expect(extend.isSubclass(Model, Emitter), 'Model is an Emitter subclass').toBeTruthy();
  model = new Model();
  expect(model.save(), 'Model.save() returns empty object').toEqual({});
  try {
    expect(model.restore({}), 'Model.restore() returns true on success').toBe(true);
    success = true;
  } catch (e) {
    success = false;
  }
  expect(success, 'model.restore() exists and is a function').toBeTruthy();
});