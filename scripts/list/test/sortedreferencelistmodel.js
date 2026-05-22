/**
 * Unit tests
 *
 * TODO test emitted events
 *
 * TODO test whether the sorted lists are readonly
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import extend from '../../lib/extend.js';
import SortedReferenceListModel from '../sortedreferencelistmodel.js';
import ListModel from '../listmodel.js';
test('SortedReferenceListModel', () => {
  let list, sorted, sortfunc, success;
  expect(
    extend.isSubclass(SortedReferenceListModel, ListModel),
    'SortedReferenceListModel is subclass of ReferenceListModel'
  ).toBeTruthy();
  list = new ListModel();
  success = false;
  try {
    sorted = new SortedReferenceListModel();
  } catch (e) {
    success = true;
  }
  expect(success, 'empty construction fails').toBeTruthy();
  sorted = new SortedReferenceListModel(list);
  expect(sorted, 'proper construction').toBeTruthy();
  expect(sorted.length, 'initial sorted list is empty').toBe(0);
  list.push(5);
  expect(sorted.length, 'pushing to the original list is mirrored by sorted list').toBe(1);
  expect(sorted.asArray(), 'element has been appended').toEqual([5]);
  list.push(2);
  list.push(1);
  list.push(4);
  expect(sorted.asArray(), 'appended elements are inserted in sort order').toEqual([1, 2, 4, 5]);
  list.remove(1);
  expect(
    sorted.asArray(),
    'correct element is removed when removing from original list'
  ).toEqual([1, 4, 5]);
  list.insert(2, 3);
  expect(sorted.asArray(), 'sorting arbitrary insertions into the original list ').toEqual([1, 3, 4, 5]);
  list.clear();
  expect(sorted.length, 'clear() is mirrored').toBe(0);
  list = new ListModel([4, 1, 2, 6, 53]);
  sorted = new SortedReferenceListModel(list);
  expect(sorted.asArray(), 'pre-initialized list is sorted on construction').toEqual([1, 2, 4, 6, 53]);
  list = new ListModel(['Erik', 'Kai', 'Fabe']);
  sorted = new SortedReferenceListModel(list);
  expect(sorted.asArray(), 'strings are sorted').toEqual(['Erik', 'Fabe', 'Kai']);
  sorted = new SortedReferenceListModel(list, SortedReferenceListModel.descending);
  expect(sorted.asArray(), 'descending order works, too').toEqual(['Kai', 'Fabe', 'Erik']);

  // descending order, even first
  sortfunc = function (a, b) {
    return a % 2 - b % 2 || b - a;
  };
  list = new ListModel();
  sorted = new SortedReferenceListModel(list, sortfunc);
  list.push(1);
  list.push(4);
  list.push(3);
  list.push(8);
  list.push(100);
  list.push(3);
  list.push(4);
  list.push(5);
  expect(sorted.asArray(), 'arbitrary sort functions are accepyted').toEqual([100, 8, 4, 4, 5, 3, 3, 1]);
  sortfunc = function () {
    return 0;
  };
  sorted = new SortedReferenceListModel(list, sortfunc);
  expect(
    sorted.asArray(),
    'sortfunction with zeroing sortfunction: ' + 'add element in list order on construction'
  ).toEqual(list.asArray());
  list.insert(2, 13);
  expect(
    sorted.asArray(),
    'zeroing sortfunction: ' + 'insertion order is not the initial list order!'
  ).toEqual([1, 4, 3, 8, 100, 3, 4, 5, 13]);

  /*
   * 'unique' parameter
   */

  sorted = new SortedReferenceListModel(list, undefined, false);
  expect(sorted.asArray(), 'non-"unique" mode').toEqual([1, 3, 3, 4, 4, 5, 8, 13, 100]);
  sorted = new SortedReferenceListModel(list, undefined, true);
  expect(sorted.asArray(), '"unique" mode').toEqual([1, 3, 4, 5, 8, 13, 100]);
  list.remove(3);
  expect(
    sorted.asArray(),
    'CAREFUL: remove() removes ALL references, not just the last one'
  ).toEqual([1, 4, 5, 8, 13, 100]);
});