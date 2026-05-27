/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import ListModel from '../listmodel.js'
import ReadonlyListModel from '../readonlylistmodel.js'
test('ReadonlyListModel', () => {
  let i
  const listener = {
    reset: function () {
      listener.length = 0
      listener.insertions = 0
      listener.removals = 0
    },
    onresize: function (emitter) {
      listener.length = emitter.length
    },
    oninsert: function () {
      listener.insertions += 1
    },
    onremove: function () {
      listener.removals += 1
    },
    emitters: []
  }
  listener.reset()
  const list = new ListModel()
  const rolist = new ReadonlyListModel(list)
  rolist.registerListener(listener)
  expect(rolist.push, 'ReadOnlyList.push: undefined').toBe(undefined)
  expect(rolist.pop, 'ReadOnlyList.pop: undefined').toBe(undefined)
  expect(rolist.insert, 'ReadOnlyList.insert: undefined').toBe(undefined)
  expect(rolist.remove, 'ReadOnlyList.remove: undefined').toBe(undefined)
  expect(rolist.set, 'ReadOnlyList.set: undefined').toBe(undefined)
  expect(rolist.erase, 'ReadOnlyList.erase: undefined').toBe(undefined)
  expect(rolist.clear, 'ReadOnlyList.clear: undefined').toBe(undefined)
  expect(rolist.length, 'initial size is 0').toBe(0)
  expect(rolist.asArray(), 'asArray returns empty array').toEqual([])
  list.push(2)
  expect(rolist.asArray(), 'first push').toEqual([2])
  expect(rolist.length, 'size after first push is 1').toBe(1)
  expect(listener.length, 'resize event fired on push').toBe(1)
  expect(listener.insertions, 'insert event fired on push').toBe(1)
  list.push(4)
  expect(rolist.asArray(), 'second push').toEqual([2, 4])
  expect(rolist.length, 'size after second push is 2').toBe(2)
  expect(listener.length, 'resize event fired on push').toBe(2)
  list.insert(0, 1)
  expect(rolist.asArray(), 'insert at front').toEqual([1, 2, 4])
  expect(rolist.length, 'size after insert is 3').toBe(3)
  expect(listener.length, 'resize event fired on insert').toBe(3)
  expect(listener.insertions, 'insert event fired on insert').toBe(3)
  list.insert(3, 5)
  expect(rolist.asArray(), 'insert at end').toEqual([1, 2, 4, 5])
  list.insert(2, 3)
  expect(rolist.asArray(), 'insert inbetween').toEqual([1, 2, 3, 4, 5])
  expect(rolist.length, 'length after all inserts').toBe(5)
  expect(
    listener.insertions,
    'number of fired insert events matches number of insertions'
  ).toBe(5)
  expect(rolist.get(0), 'get 1').toBe(1)
  expect(rolist.get(1), 'get 2').toBe(2)
  expect(rolist.get(2), 'get 3').toBe(3)
  expect(rolist.get(3), 'get 4').toBe(4)
  expect(rolist.get(4), 'get 5').toBe(5)
  expect(rolist.get(-1), 'get out of bounds (index -1)').toBe(undefined)
  expect(rolist.get(5), 'get slightly out of bounds (index 5)').toBe(undefined)
  expect(rolist.get(1234567890), 'get wildly out of bounds (index 1234567890)').toBe(undefined)
  expect(rolist.indexOf(1), 'indexOf: first element').toBe(0)
  expect(rolist.indexOf(5), 'indexOf: last element').toBe(4)
  expect(rolist.indexOf('unavailable'), 'indexOf: unavailable element').toBe(-1)
  expect(list.remove(0), 'remove returns the removed object').toBe(1)
  expect(rolist.asArray(), 'remove at front').toEqual([2, 3, 4, 5])
  expect(rolist.length, 'length after remove').toBe(4)
  expect(listener.length, 'resize event fired on remove').toBe(4)
  expect(listener.removals, 'remove event fired on remove').toBe(1)
  expect(list.pop(3), 'pop returns the removed object').toBe(5)
  expect(rolist.asArray(), 'pop (remove at back)').toEqual([2, 3, 4])
  expect(rolist.length, 'length after remove').toBe(3)
  expect(listener.removals, 'remove event fired on pop').toBe(2)
  expect(list.remove(1), 'remove returns the removed object').toBe(3)
  expect(rolist.asArray(), 'remove inbetween').toEqual([2, 4])
  expect(rolist.length, 'length after remove').toBe(2)
  expect(list.remove(123), 'remove out of bounds does nothing').toBe(undefined)
  expect(rolist.asArray(), 'remove out of bounds').toEqual([2, 4])
  expect(rolist.length, 'length after remove out of bounds').toBe(2)
  list.set(1, 123)
  expect(rolist.length, 'set does not change length').toBe(2)
  expect(rolist.asArray(), 'list.set actually sets the value').toEqual([2, 123])
  expect(
    listener.length,
    'resize event balanced on set() (may have been fired twice)'
  ).toBe(2)
  listener.reset()
  expect(list.set(123, 321), "set out of bounds doesn't to anything").toBe(undefined)
  expect(rolist.asArray(), "set out of bounds really doesn't to anything").toEqual([2, 123])
  expect(listener.insertions, "set out of bounds doesn't fire insert event").toBe(0)
  expect(listener.removals, "set out of bounds doesn't fire remove event").toBe(0)
  list.clear()
  expect(rolist.length, 'list length is 0 after clear').toBe(0)
  expect(listener.length, 'resize event fired on clear)').toBe(0)
  expect(listener.removals, 'clear fires remove events').toBe(2)
  list.push(4)
  list.push(3)
  list.push(2)
  list.push(1)
  i = 0
  const ret = rolist.map(function (num, index, thelist) {
    expect(this, 'map(): this === thisArg, ' + index).toBe(5)
    expect(index, 'map(): iterating in ascending order, ' + index).toBe(i)
    expect(num, 'first argument is the list content' + index).toBe(rolist.length - index)
    expect(thelist, 'map(): third function argument is the list, ' + index).toBe(rolist)
    i += 1
    return num * num
  }, 5)
  const res = [16, 9, 4, 1]
  expect(ret, 'map(): return value is preserved').toEqual(res)
  list.clear()
  expect(rolist.length, 'cleared size is 0').toBe(0)
  expect(rolist.asArray(), 'asArray returns empty array after clear').toEqual([])
  const obj = {
    tmp: true,
    tmpLong: 'very much so'
  }
  list.push(obj)
  expect(rolist.get(0), 'objects are directly referenced, not copied').toBe(obj)
  expect(list.pop(), 'pop returns the popped object directly').toBe(obj)
  expect(rolist.length, 'popped size is 0').toBe(0)
  expect(rolist.asArray(), 'asArray returns empty array after pop').toEqual([])
})
