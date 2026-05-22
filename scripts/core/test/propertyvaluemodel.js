/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import extend from '../../lib/extend.js';
import PropertyValueModel from '../propertyvaluemodel.js';
import PropertyModel from '../propertymodel.js';
import ValueModel from '../valuemodel.js';
import Listener from '../listener.js';
test('PropertyValueModel', () => {
  let model, value, listener;
  expect(
    extend.isSubclass(PropertyValueModel, ValueModel),
    'PropertyValueModel is subclass of ValueModel'
  ).toBeTruthy();
  model = new PropertyModel({
    bool: true,
    num: 5,
    str: 'dapfen'
  });
  value = new PropertyValueModel(model, 'bool');
  expect(value, 'bool value initialization').toBeTruthy();
  expect(value.get(), 'value is initialized to current value').toBe(true);
  listener = new Listener(value);
  listener.updates = 0;
  listener.onupdate = function () {
    this.updates += 1;
  };
  model.setProperty('bool', false);
  expect(listener.updates, 'value: 1 propagate update').toBe(1);
  expect(value.get(), 'value is propagated to value').toBe(false);
  listener.updates = 0;
  value.set(true);
  expect(listener.updates, 'value.set(): no event loop').toBe(1);
  expect(value.get(), 'value is properly set').toBe(true);
  expect(model.getProperty('bool'), 'value is propagated to PropertyModel').toBe(true);
  listener.updates = 0;
  value.set(value.get());
  expect(listener.updates, 'value.set(value.get()): no-op').toBe(0);
  listener.updates = 0;
  model.setProperty('bool', model.getProperty('bool'));
  expect(listener.updates, 'setProp(getProp()): no-op').toBe(0);
});