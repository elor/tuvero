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
import ListUpdateListener from '../listupdatelistener.js';
test('ListUpdateListener', () => {
  let list, listener, ref;
  list = new ListModel();
  list.push(1);

  /*
   * Test new-constructed instances
   */
  ref = 0;
  listener = new ListUpdateListener(list, function (data) {
    if (ref === 0) {
      expect(this, 'callback "this" is the list').toBe(list);
    }
    ref += 1;
  });
  expect(listener, 'construction via "new" works').toBeTruthy();
  expect(ref, 'callback is not called on construction').toBe(0);
  list.push(2);
  expect(ref, 'callback is called on push').toBe(1);
  list.insert(0, 3);
  expect(ref, 'callback is called on insert').toBe(2);
  list.pop();
  expect(ref, 'callback is called on pop').toBe(3);
  list.remove(0);
  expect(ref, 'callback is called on remove').toBe(4);
  list.erase(1);
  expect(ref, 'callback is called on erase').toBe(5);
  list.clear();
  expect(ref, 'callback is called on clear').toBe(6);
  listener.destroy();
  list.push(5);
  expect(ref, 'listener is unregistered on destroy').toBe(6);

  /*
   * Test bind()-constructed instances
   */
  ref = 0;
  ListUpdateListener.bind(list, function () {
    if (ref === 0) {
      expect(this, 'callback "this" is the list').toBe(list);
    }
    ref += 1;
  });
  expect(listener, 'construction via "bind()" works').toBeTruthy();
  expect(ref, 'callback is not called on bind-construction').toBe(0);
  list.push(2);
  expect(ref, 'callback is called on push').toBe(1);
  list.insert(0, 3);
  expect(ref, 'callback is called on insert').toBe(2);
  list.pop();
  expect(ref, 'callback is called on pop').toBe(3);
  list.remove(0);
  expect(ref, 'callback is called on remove').toBe(4);
  list.erase(5);
  expect(ref, 'callback is called on erase').toBe(5);
  list.clear();
  expect(ref, 'callback is called on clear').toBe(6);
});