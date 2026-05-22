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
import Model from '../../core/model.js';
import extend from '../../lib/extend.js';
var DummyModel;

/*
 * dummy Model, which can be saved/restored for testing
 */
DummyModel = function (optional) {
  if (optional) {
    this.data = 'asd' + optional;
  }
  this.save = function () {
    return {
      d: this.data.replace(/^asd/, '')
    };
  };
  this.restore = function (data) {
    this.data = 'asd' + data.d;
    return true;
  };
};
extend(DummyModel, Model);
test('ListModel', () => {
  var list, obj, i, ret, res, listener, data;
  listener = {
    reset: function () {
      listener.length = 0;
      listener.insertions = 0;
      listener.removals = 0;
    },
    onresize: function (emitter) {
      listener.length = emitter.length;
    },
    oninsert: function () {
      listener.insertions += 1;
    },
    onremove: function () {
      listener.removals += 1;
    },
    emitters: []
  };
  listener.reset();
  list = new ListModel();
  list.registerListener(listener);
  expect(list.length, 'initial size is 0').toBe(0);
  expect(list.asArray(), 'asArray returns empty array').toEqual([]);
  list.push(2);
  expect(list.asArray(), 'first push').toEqual([2]);
  expect(list.length, 'size after first push is 1').toBe(1);
  expect(listener.length, 'resize event fired on push').toBe(1);
  expect(listener.insertions, 'insert event fired on push').toBe(1);
  list.push(4);
  expect(list.asArray(), 'second push').toEqual([2, 4]);
  expect(list.length, 'size after second push is 2').toBe(2);
  expect(listener.length, 'resize event fired on push').toBe(2);
  list.insert(0, 1);
  expect(list.asArray(), 'insert at front').toEqual([1, 2, 4]);
  expect(list.length, 'size after insert is 3').toBe(3);
  expect(listener.length, 'resize event fired on insert').toBe(3);
  expect(listener.insertions, 'insert event fired on insert').toBe(3);
  list.insert(3, 5);
  expect(list.asArray(), 'insert at end').toEqual([1, 2, 4, 5]);
  list.insert(2, 3);
  expect(list.asArray(), 'insert inbetween').toEqual([1, 2, 3, 4, 5]);
  expect(list.length, 'length after all inserts').toBe(5);
  expect(
    listener.insertions,
    'number of fired insert events matches number of insertions'
  ).toBe(5);
  expect(list.get(0), 'get 1').toBe(1);
  expect(list.get(1), 'get 2').toBe(2);
  expect(list.get(2), 'get 3').toBe(3);
  expect(list.get(3), 'get 4').toBe(4);
  expect(list.get(4), 'get 5').toBe(5);
  expect(list.get(-1), 'get out of bounds (index -1)').toBe(undefined);
  expect(list.get(5), 'get slightly out of bounds (index 5)').toBe(undefined);
  expect(list.get(1234567890), 'get wildly out of bounds (index 1234567890)').toBe(undefined);
  expect(list.indexOf(1), 'indexOf: first element').toBe(0);
  expect(list.indexOf(5), 'indexOf: last element').toBe(4);
  expect(list.indexOf('unavailable'), 'indexOf: unavailable element').toBe(-1);
  expect(list.includes(1), 'includes: first element').toBe(true);
  expect(list.includes(3), 'includes: middle element').toBe(true);
  expect(list.includes(5), 'includes: last element').toBe(true);
  expect(list.includes(0), 'includes: unavailable').toBe(false);
  expect(list.includes(-1), 'includes: another unavailable').toBe(false);
  expect(list.remove(0), 'remove returns the removed object').toBe(1);
  expect(list.asArray(), 'remove at front').toEqual([2, 3, 4, 5]);
  expect(list.length, 'length after remove').toBe(4);
  expect(listener.length, 'resize event fired on remove').toBe(4);
  expect(listener.removals, 'remove event fired on remove').toBe(1);
  expect(list.pop(3), 'pop returns the removed object').toBe(5);
  expect(list.asArray(), 'pop (remove at back)').toEqual([2, 3, 4]);
  expect(list.length, 'length after remove').toBe(3);
  expect(listener.removals, 'remove event fired on pop').toBe(2);
  expect(list.remove(1), 'remove returns the removed object').toBe(3);
  expect(list.asArray(), 'remove inbetween').toEqual([2, 4]);
  expect(list.length, 'length after remove').toBe(2);
  expect(list.remove(123), 'remove out of bounds does nothing').toBe(undefined);
  expect(list.asArray(), 'remove out of bounds').toEqual([2, 4]);
  expect(list.length, 'length after remove out of bounds').toBe(2);
  list.set(1, 123);
  expect(list.length, 'set does not change length').toBe(2);
  expect(list.asArray(), 'list.set actually sets the value').toEqual([2, 123]);
  expect(
    listener.length,
    'resize event balanced on set() (may have been fired twice)'
  ).toBe(2);
  listener.reset();
  expect(list.set(123, 321), "set out of bounds doesn't to anything").toBe(undefined);
  expect(list.asArray(), "set out of bounds really doesn't to anything").toEqual([2, 123]);
  expect(listener.insertions, "set out of bounds doesn't fire insert event").toBe(0);
  expect(listener.removals, "set out of bounds doesn't fire remove event").toBe(0);
  list.clear();
  expect(list.length, 'list length is 0 after clear').toBe(0);
  expect(listener.length, 'resize event fired on clear)').toBe(0);
  expect(listener.removals, 'clear fires remove events').toBe(2);
  list.push(4);
  list.push(3);
  list.push(2);
  list.push(1);
  i = 0;
  ret = list.map(function (num, index, thelist) {
    expect(this, 'map(): this === thisArg, ' + index).toBe(5);
    expect(index, 'map(): iterating in ascending order, ' + index).toBe(i);
    expect(num, 'first argument is the list content' + index).toBe(list.length - index);
    expect(thelist, 'map(): third function argument is the list, ' + index).toBe(list);
    i += 1;
    return num * num;
  }, 5);
  res = [16, 9, 4, 1];
  expect(ret, 'map(): return value is preserved').toEqual(res);
  list.clear();
  expect(list.length, 'cleared size is 0').toBe(0);
  expect(list.asArray(), 'asArray returns empty array after clear').toEqual([]);
  obj = {
    tmp: true,
    tmpLong: 'very much so'
  };
  list.push(obj);
  expect(list.get(0), 'objects are directly referenced, not copied').toBe(obj);
  expect(list.pop(), 'pop returns the popped object directly').toBe(obj);
  expect(list.length, 'popped size is 0').toBe(0);
  expect(list.asArray(), 'asArray returns empty array after pop').toEqual([]);
  list = new ListModel();
  list.push(3);
  list.push(2);
  list.push(3);
  list.push(4);
  list.push(3);
  list.push('3');
  expect(list.erase(3), 'erase() returns number of removals').toBe(3);
  expect(list.includes(3), 'erase removes all instances').toBe(false);
  expect(list.indexOf(3), 'erased element has no index anymore').toBe(-1);
  expect(list.length, 'erase resizes the list').toBe(3);
  expect(list.erase('notfound'), 'erase() returns 0 if not found').toBe(0);
  list = new ListModel();
  list.makeReadonly();
  expect(list.insert, 'makereadonly: insert() disabled').toBe(undefined);
  expect(list.remove, 'makereadonly: remove() disabled').toBe(undefined);
  expect(list.push, 'makereadonly: push() disabled').toBe(undefined);
  expect(list.pop, 'makereadonly: pop() disabled').toBe(undefined);
  expect(list.clear, 'makereadonly: clear() disabled').toBe(undefined);
  expect(list.erase, 'makereadonly: erase() disabled').toBe(undefined);
  list = new ListModel();
  list.push(5);
  list.push(3);
  list.push(4);
  list.push(2);
  list.push(3);
  list.push(1);
  data = list.save();
  expect(data, 'save() returns').toBeTruthy();
  expect(data, 'save() uses a list representation for raw types').toEqual([5, 3, 4, 2, 3, 1]);
  list = new ListModel();
  expect(list.restore(data), 'restore() returns').toBeTruthy();
  expect(list.asArray(), 'restore() restores the whole list').toEqual([5, 3, 4, 2, 3, 1]);
  list.clear();
  list.push('Tuvero');
  list.push('is');
  list.push('awesome');
  data = list.save();
  expect(data, 'saved data object is just an array of strings').toEqual(['Tuvero', 'is', 'awesome']);
  list.clear();
  list.push(new DummyModel(5));
  list.push(new DummyModel(3));
  list.push(new DummyModel(4));
  list.push(new DummyModel(2));
  list.push(new DummyModel(3));
  list.push(new DummyModel(1));
  data = list.save();
  expect(data, 'save() calls save() recursively').toBeTruthy();
  expect(data[0].d, 'save() really calls save() recursively').toBeTruthy();
  expect(!data[0].save, 'save() really really calls save() recursively').toBeTruthy();
  list = new ListModel();
  expect(list.restore(data, DummyModel), 'restore() with Model Constructor returns').toBeTruthy();
  expect(list.length, 'restore() restores the length').toBe(data.length);
  expect(list.get(0).data, 'restore() constructs the object').toBe('asd5');
  expect(list.get(1).data, 'restore() constructs the object').toBe('asd3');
  expect(list.get(2).data, 'restore() constructs the object').toBe('asd4');
  expect(list.get(3).data, 'restore() constructs the object').toBe('asd2');
  expect(list.get(4).data, 'restore() constructs the object').toBe('asd3');
  expect(list.get(5).data, 'restore() constructs the object').toBe('asd1');
  expect(list.restore(data, DummyModel), 'restore() with Model Factory returns').toBeTruthy();
  expect(list.length, 'restore() restores the length').toBe(data.length);
  expect(list.get(0).data, 'restore() constructs the object').toBe('asd5');
  expect(list.get(1).data, 'restore() constructs the object').toBe('asd3');
  expect(list.get(2).data, 'restore() constructs the object').toBe('asd4');
  expect(list.get(3).data, 'restore() constructs the object').toBe('asd2');
  expect(list.get(4).data, 'restore() constructs the object').toBe('asd3');
  expect(list.get(5).data, 'restore() constructs the object').toBe('asd1');
});