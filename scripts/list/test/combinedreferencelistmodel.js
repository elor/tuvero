/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import CombinedReferenceListModel from '../combinedreferencelistmodel.js';
import ListModel from '../listmodel.js';
test('CombinedReferenceListModel', () => {
  let list1, list2, combined, success;
  expect(
    CombinedReferenceListModel.prototype instanceof ListModel,
    'CombinedReferenceListModel is subclass of ListModel'
  ).toBeTruthy();
  success = false;
  try {
    combined = new CombinedReferenceListModel();
  } catch (e) {
    success = true;
  }
  expect(success, 'empty construction currently fails').toBeTruthy();
  list1 = new ListModel();
  combined = new CombinedReferenceListModel(list1);
  expect(combined, 'construction with a single list works').toBeTruthy();
  expect(combined.length, 'initial length is 0').toBe(0);
  list1.push(5);
  expect(combined.length, 'an element gets added').toBe(1);
  expect(combined.asArray(), 'correct element was added').toEqual([5]);
  list1.insert(0, 1);
  expect(combined.asArray(), 'insertion is mirrored').toEqual([1, 5]);
  list1.push(8);
  expect(combined.asArray(), 'push is mirrored').toEqual([1, 5, 8]);
  list1.remove(1);
  expect(combined.asArray(), 'remove is mirrored').toEqual([1, 8]);
  list1.pop();
  expect(combined.asArray(), 'pop is mirrored').toEqual([1]);
  list1.clear();
  expect(combined.asArray(), 'clear is mirrored').toEqual([]);
  list1 = new ListModel([1, 3, 5]);
  list2 = new ListModel([2, 4, 6]);
  combined = new CombinedReferenceListModel(list1, list2);
  expect(combined.asArray(), 'multiple lists are appended').toEqual([1, 3, 5, 2, 4, 6]);
  list2.insert(1, 13);
  expect(combined.asArray(), 'list offsets are correct').toEqual([1, 3, 5, 2, 13, 4, 6]);
  list1.clear();
  expect(
    combined.asArray(),
    'clear() shifts all following elements towards the front'
  ).toEqual([2, 13, 4, 6]);
  list1 = new ListModel([1, 3, 5]);
  combined = new CombinedReferenceListModel(list1, new CombinedReferenceListModel(list1), new CombinedReferenceListModel(list1));
  expect(combined.asArray(), 'combining the same list three times').toEqual([1, 3, 5, 1, 3, 5, 1, 3, 5]);
  list1.push(7);
  expect(combined.asArray(), 'pushing to the triply-combined list').toEqual([1, 3, 5, 7, 1, 3, 5, 7, 1, 3, 5, 7]);
});