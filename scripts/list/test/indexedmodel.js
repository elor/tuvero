/**
 * Unit tests for IndexedModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Model from '../../core/model.js';
import IndexedModel from '../indexedmodel.js';
test('IndexedModel', () => {
  let model, listener, data;
  expect(
    IndexedModel.prototype instanceof Model,
    'IndexedModel is subclass of Model'
  ).toBeTruthy();
  listener = {
    updatecount: 0,
    /**
     * Callback listener
     */
    onupdate: function () {
      listener.updatecount += 1;
    },
    /**
     * counter reset
     */
    reset: function () {
      listener.updatecount = 0;
    },
    emitters: []
  };
  model = new IndexedModel();
  expect(model.getID(), 'empty initialization sets id to -1').toBe(-1);
  model.setID(0);
  expect(model.getID(), 'setID(0) actually sets the id to 0, not -1').toBe(0);
  model = new IndexedModel(5);
  expect(model.getID(), 'proper initialization sets id').toBe(5);
  model.registerListener(listener);
  model.setID(8);
  expect(model.getID(), 'setID sets the id').toBe(8);
  expect(listener.updatecount, 'setID emits update').toBe(1);
  listener.reset();
  model.setID(8);
  expect(
    listener.updatecount,
    'setID does not emit update if the ids are identical'
  ).toBe(0);
  model.setID();
  expect(model.getID(), 'empty setID sets the id to -1').toBe(-1);
  model.setID(5);
  data = model.save();
  expect(data, 'Model.save() returns something').toBeTruthy();
  model = new IndexedModel(3);
  expect(model.restore(data), 'restore() works').toBe(true);
  expect(model.getID(), 'save() and restore() work').toBe(5);
});