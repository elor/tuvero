/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import ListModel from '../listmodel.js';
import UniqueListModel from '../../core/uniquelistmodel.js';
import extend from '../../lib/extend.js';
test('UniqueListModel', () => {
  let list;
  expect(
    extend.isSubclass(UniqueListModel, ListModel),
    'UniqueListModel is subclass of ListModel'
  ).toBeTruthy();
  list = new UniqueListModel();
  expect(list.push(1), 'push works').toBe(1);
  expect(list.push(2), 'push works').toBe(2);
  expect(list.push(1), 'push aborts').toBe(undefined);
  expect(list.push(3), 'push works').toBe(3);
  expect(list.push(1), 'push aborts').toBe(undefined);
  expect(list.push(5), 'push works').toBe(4);
  expect(list.push(1), 'push aborts').toBe(undefined);
  expect(list.asArray(), 'push() inserts once').toEqual([1, 2, 3, 5]);
  expect(list.set(2, 1), 'set aborts').toBe(undefined);
  expect(list.asArray(), 'set() does not remove').toEqual([1, 2, 3, 5]);
  expect(list.set(2, 4), 'set works').toBe(4);
  expect(list.asArray(), 'set() still works').toEqual([1, 2, 4, 5]);
  expect(list.insert(2, 1), 'insert aborts').toBe(undefined);
  expect(list.asArray(), 'insert() doesnt insert').toEqual([1, 2, 4, 5]);
  expect(list.insert(2, 3), 'insert still works').toBe(3);
  expect(list.asArray(), 'insert() still works').toEqual([1, 2, 3, 4, 5]);
});