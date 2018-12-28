/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var ListModel, ReadonlyListModel

    ListModel = getModule('list/listmodel')
    ReadonlyListModel = getModule('list/readonlylistmodel')

    QUnit.test('ReadonlyListModel', function (assert) {
      var list, obj, i, ret, res, listener, rolist

      listener = {
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

      list = new ListModel()
      rolist = new ReadonlyListModel(list)
      rolist.registerListener(listener)

      assert.equal(rolist.push, undefined, 'ReadOnlyList.push: undefined')
      assert.equal(rolist.pop, undefined, 'ReadOnlyList.pop: undefined')
      assert.equal(rolist.insert, undefined, 'ReadOnlyList.insert: undefined')
      assert.equal(rolist.remove, undefined, 'ReadOnlyList.remove: undefined')
      assert.equal(rolist.set, undefined, 'ReadOnlyList.set: undefined')
      assert.equal(rolist.erase, undefined, 'ReadOnlyList.erase: undefined')
      assert.equal(rolist.clear, undefined, 'ReadOnlyList.clear: undefined')

      assert.equal(rolist.length, 0, 'initial size is 0')
      assert.deepEqual(rolist.asArray(), [], 'asArray returns empty array')

      list.push(2)
      assert.deepEqual(rolist.asArray(), [2], 'first push')
      assert.equal(rolist.length, 1, 'size after first push is 1')
      assert.equal(listener.length, 1, 'resize event fired on push')
      assert.equal(listener.insertions, 1, 'insert event fired on push')

      list.push(4)
      assert.deepEqual(rolist.asArray(), [2, 4], 'second push')
      assert.equal(rolist.length, 2, 'size after second push is 2')
      assert.equal(listener.length, 2, 'resize event fired on push')

      list.insert(0, 1)
      assert.deepEqual(rolist.asArray(), [1, 2, 4], 'insert at front')
      assert.equal(rolist.length, 3, 'size after insert is 3')
      assert.equal(listener.length, 3, 'resize event fired on insert')
      assert.equal(listener.insertions, 3, 'insert event fired on insert')

      list.insert(3, 5)
      assert.deepEqual(rolist.asArray(), [1, 2, 4, 5], 'insert at end')

      list.insert(2, 3)
      assert.deepEqual(rolist.asArray(), [1, 2, 3, 4, 5], 'insert inbetween')

      assert.equal(rolist.length, 5, 'length after all inserts')
      assert.equal(listener.insertions, 5,
        'number of fired insert events matches number of insertions')

      assert.equal(rolist.get(0), 1, 'get 1')
      assert.equal(rolist.get(1), 2, 'get 2')
      assert.equal(rolist.get(2), 3, 'get 3')
      assert.equal(rolist.get(3), 4, 'get 4')
      assert.equal(rolist.get(4), 5, 'get 5')

      assert.equal(rolist.get(-1), undefined, 'get out of bounds (index -1)')
      assert.equal(rolist.get(5), undefined,
        'get slightly out of bounds (index 5)')
      assert.equal(rolist.get(1234567890), undefined,
        'get wildly out of bounds (index 1234567890)')

      assert.equal(rolist.indexOf(1), 0, 'indexOf: first element')
      assert.equal(rolist.indexOf(5), 4, 'indexOf: last element')
      assert.equal(rolist.indexOf('unavailable'), -1,
        'indexOf: unavailable element')

      assert.equal(list.remove(0), 1, 'remove returns the removed object')
      assert.deepEqual(rolist.asArray(), [2, 3, 4, 5], 'remove at front')
      assert.equal(rolist.length, 4, 'length after remove')
      assert.equal(listener.length, 4, 'resize event fired on remove')
      assert.equal(listener.removals, 1, 'remove event fired on remove')

      assert.equal(list.pop(3), 5, 'pop returns the removed object')
      assert.deepEqual(rolist.asArray(), [2, 3, 4], 'pop (remove at back)')
      assert.equal(rolist.length, 3, 'length after remove')
      assert.equal(listener.removals, 2, 'remove event fired on pop')

      assert.equal(list.remove(1), 3, 'remove returns the removed object')
      assert.deepEqual(rolist.asArray(), [2, 4], 'remove inbetween')
      assert.equal(rolist.length, 2, 'length after remove')

      assert.equal(list.remove(123), undefined,
        'remove out of bounds does nothing')
      assert.deepEqual(rolist.asArray(), [2, 4], 'remove out of bounds')
      assert.equal(rolist.length, 2, 'length after remove out of bounds')

      list.set(1, 123)
      assert.equal(rolist.length, 2, 'set does not change length')
      assert.deepEqual(rolist.asArray(), [2, 123],
        'list.set actually sets the value')
      assert.equal(listener.length, 2,
        'resize event balanced on set() (may have been fired twice)')

      listener.reset()

      assert.equal(list.set(123, 321), undefined,
        "set out of bounds doesn't to anything")
      assert.deepEqual(rolist.asArray(), [2, 123],
        "set out of bounds really doesn't to anything")
      assert.equal(listener.insertions, 0,
        "set out of bounds doesn't fire insert event")
      assert.equal(listener.removals, 0,
        "set out of bounds doesn't fire remove event")

      list.clear()
      assert.equal(rolist.length, 0, 'list length is 0 after clear')
      assert.equal(listener.length, 0, 'resize event fired on clear)')
      assert.equal(listener.removals, 2, 'clear fires remove events')

      list.push(4)
      list.push(3)
      list.push(2)
      list.push(1)

      i = 0

      ret = rolist.map(function (num, index, thelist) {
        assert.equal(this, 5, 'map(): this === thisArg, ' + index)
        assert.equal(index, i, 'map(): iterating in ascending order, ' + index)
        assert.equal(num, rolist.length - index,
          'first argument is the list content' + index)
        assert.equal(thelist, rolist,
          'map(): third function argument is the list, ' + index)
        i += 1
        return num * num
      }, 5)

      res = [16, 9, 4, 1]
      assert.deepEqual(ret, res, 'map(): return value is preserved')

      list.clear()

      assert.equal(rolist.length, 0, 'cleared size is 0')
      assert.deepEqual(rolist.asArray(), [],
        'asArray returns empty array after clear')

      obj = {
        tmp: true,
        tmpLong: 'very much so'
      }

      list.push(obj)

      assert.equal(rolist.get(0), obj,
        'objects are directly referenced, not copied')
      assert.equal(list.pop(), obj, 'pop returns the popped object directly')

      assert.equal(rolist.length, 0, 'popped size is 0')
      assert.deepEqual(rolist.asArray(), [],
        'asArray returns empty array after pop')
    })
  }
})
