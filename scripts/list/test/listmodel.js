/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var ListModel, DummyModel, extend, Model

    ListModel = getModule('list/listmodel')
    Model = getModule('core/model')
    extend = getModule('lib/extend')

    /*
     * dummy Model, which can be saved/restored for testing
     */
    DummyModel = function (optional) {
      if (optional) {
        this.data = 'asd' + optional
      }

      this.save = function () {
        return {
          d: this.data.replace(/^asd/, '')
        }
      }
      this.restore = function (data) {
        this.data = 'asd' + data.d
        return true
      }
    }
    extend(DummyModel, Model)

    QUnit.test('ListModel', function (assert) {
      var list, obj, i, ret, res, listener, data

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
      list.registerListener(listener)

      assert.equal(list.length, 0, 'initial size is 0')
      assert.deepEqual(list.asArray(), [], 'asArray returns empty array')

      list.push(2)
      assert.deepEqual(list.asArray(), [2], 'first push')
      assert.equal(list.length, 1, 'size after first push is 1')
      assert.equal(listener.length, 1, 'resize event fired on push')
      assert.equal(listener.insertions, 1, 'insert event fired on push')

      list.push(4)
      assert.deepEqual(list.asArray(), [2, 4], 'second push')
      assert.equal(list.length, 2, 'size after second push is 2')
      assert.equal(listener.length, 2, 'resize event fired on push')

      list.insert(0, 1)
      assert.deepEqual(list.asArray(), [1, 2, 4], 'insert at front')
      assert.equal(list.length, 3, 'size after insert is 3')
      assert.equal(listener.length, 3, 'resize event fired on insert')
      assert.equal(listener.insertions, 3, 'insert event fired on insert')

      list.insert(3, 5)
      assert.deepEqual(list.asArray(), [1, 2, 4, 5], 'insert at end')

      list.insert(2, 3)
      assert.deepEqual(list.asArray(), [1, 2, 3, 4, 5], 'insert inbetween')

      assert.equal(list.length, 5, 'length after all inserts')
      assert.equal(listener.insertions, 5,
        'number of fired insert events matches number of insertions')

      assert.equal(list.get(0), 1, 'get 1')
      assert.equal(list.get(1), 2, 'get 2')
      assert.equal(list.get(2), 3, 'get 3')
      assert.equal(list.get(3), 4, 'get 4')
      assert.equal(list.get(4), 5, 'get 5')

      assert.equal(list.get(-1), undefined, 'get out of bounds (index -1)')
      assert.equal(list.get(5), undefined,
        'get slightly out of bounds (index 5)')
      assert.equal(list.get(1234567890), undefined,
        'get wildly out of bounds (index 1234567890)')

      assert.equal(list.indexOf(1), 0, 'indexOf: first element')
      assert.equal(list.indexOf(5), 4, 'indexOf: last element')
      assert.equal(list.indexOf('unavailable'), -1,
        'indexOf: unavailable element')

      assert.equal(list.includes(1), true, 'includes: first element')
      assert.equal(list.includes(3), true, 'includes: middle element')
      assert.equal(list.includes(5), true, 'includes: last element')
      assert.equal(list.includes(0), false, 'includes: unavailable')
      assert.equal(list.includes(-1), false, 'includes: another unavailable')

      assert.equal(list.remove(0), 1, 'remove returns the removed object')
      assert.deepEqual(list.asArray(), [2, 3, 4, 5], 'remove at front')
      assert.equal(list.length, 4, 'length after remove')
      assert.equal(listener.length, 4, 'resize event fired on remove')
      assert.equal(listener.removals, 1, 'remove event fired on remove')

      assert.equal(list.pop(3), 5, 'pop returns the removed object')
      assert.deepEqual(list.asArray(), [2, 3, 4], 'pop (remove at back)')
      assert.equal(list.length, 3, 'length after remove')
      assert.equal(listener.removals, 2, 'remove event fired on pop')

      assert.equal(list.remove(1), 3, 'remove returns the removed object')
      assert.deepEqual(list.asArray(), [2, 4], 'remove inbetween')
      assert.equal(list.length, 2, 'length after remove')

      assert.equal(list.remove(123), undefined,
        'remove out of bounds does nothing')
      assert.deepEqual(list.asArray(), [2, 4], 'remove out of bounds')
      assert.equal(list.length, 2, 'length after remove out of bounds')

      list.set(1, 123)
      assert.equal(list.length, 2, 'set does not change length')
      assert.deepEqual(list.asArray(), [2, 123],
        'list.set actually sets the value')
      assert.equal(listener.length, 2,
        'resize event balanced on set() (may have been fired twice)')

      listener.reset()

      assert.equal(list.set(123, 321), undefined,
        "set out of bounds doesn't to anything")
      assert.deepEqual(list.asArray(), [2, 123],
        "set out of bounds really doesn't to anything")
      assert.equal(listener.insertions, 0,
        "set out of bounds doesn't fire insert event")
      assert.equal(listener.removals, 0,
        "set out of bounds doesn't fire remove event")

      list.clear()
      assert.equal(list.length, 0, 'list length is 0 after clear')
      assert.equal(listener.length, 0, 'resize event fired on clear)')
      assert.equal(listener.removals, 2, 'clear fires remove events')

      list.push(4)
      list.push(3)
      list.push(2)
      list.push(1)

      i = 0

      ret = list.map(function (num, index, thelist) {
        assert.equal(this, 5, 'map(): this === thisArg, ' + index)
        assert.equal(index, i, 'map(): iterating in ascending order, ' + index)
        assert.equal(num, list.length - index,
          'first argument is the list content' + index)
        assert.equal(thelist, list,
          'map(): third function argument is the list, ' + index)
        i += 1
        return num * num
      }, 5)

      res = [16, 9, 4, 1]
      assert.deepEqual(ret, res, 'map(): return value is preserved')

      list.clear()

      assert.equal(list.length, 0, 'cleared size is 0')
      assert.deepEqual(list.asArray(), [],
        'asArray returns empty array after clear')

      obj = {
        tmp: true,
        tmpLong: 'very much so'
      }

      list.push(obj)

      assert.equal(list.get(0), obj,
        'objects are directly referenced, not copied')
      assert.equal(list.pop(), obj, 'pop returns the popped object directly')

      assert.equal(list.length, 0, 'popped size is 0')
      assert.deepEqual(list.asArray(), [],
        'asArray returns empty array after pop')

      list = new ListModel()
      list.push(3)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(3)
      list.push('3')

      assert.equal(list.erase(3), 3, 'erase() returns number of removals')
      assert.equal(list.includes(3), false, 'erase removes all instances')
      assert.equal(list.indexOf(3), -1, 'erased element has no index anymore')
      assert.equal(list.length, 3, 'erase resizes the list')

      assert.equal(list.erase('notfound'), 0, 'erase() returns 0 if not found')

      list = new ListModel()
      list.makeReadonly()
      assert.equal(list.insert, undefined, 'makereadonly: insert() disabled')
      assert.equal(list.remove, undefined, 'makereadonly: remove() disabled')
      assert.equal(list.push, undefined, 'makereadonly: push() disabled')
      assert.equal(list.pop, undefined, 'makereadonly: pop() disabled')
      assert.equal(list.clear, undefined, 'makereadonly: clear() disabled')
      assert.equal(list.erase, undefined, 'makereadonly: erase() disabled')

      list = new ListModel()
      list.push(5)
      list.push(3)
      list.push(4)
      list.push(2)
      list.push(3)
      list.push(1)
      data = list.save()
      assert.ok(data, 'save() returns')
      assert.deepEqual(data, [5, 3, 4, 2, 3, 1],
        'save() uses a list representation for raw types')
      list = new ListModel()
      assert.ok(list.restore(data), 'restore() returns')
      assert.deepEqual(list.asArray(), [5, 3, 4, 2, 3, 1],
        'restore() restores the whole list')

      list.clear()
      list.push('Tuvero')
      list.push('is')
      list.push('awesome')
      data = list.save()
      assert.deepEqual(data, ['Tuvero', 'is', 'awesome'],
        'saved data object is just an array of strings')

      list.clear()
      list.push(new DummyModel(5))
      list.push(new DummyModel(3))
      list.push(new DummyModel(4))
      list.push(new DummyModel(2))
      list.push(new DummyModel(3))
      list.push(new DummyModel(1))
      data = list.save()
      assert.ok(data, 'save() calls save() recursively')
      assert.ok(data[0].d, 'save() really calls save() recursively')
      assert.ok(!data[0].save, 'save() really really calls save() recursively')

      list = new ListModel()
      assert.ok(list.restore(data, DummyModel),
        'restore() with Model Constructor returns')
      assert.equal(list.length, data.length, 'restore() restores the length')
      assert.equal(list.get(0).data, 'asd5', 'restore() constructs the object')
      assert.equal(list.get(1).data, 'asd3', 'restore() constructs the object')
      assert.equal(list.get(2).data, 'asd4', 'restore() constructs the object')
      assert.equal(list.get(3).data, 'asd2', 'restore() constructs the object')
      assert.equal(list.get(4).data, 'asd3', 'restore() constructs the object')
      assert.equal(list.get(5).data, 'asd1', 'restore() constructs the object')

      assert.ok(list.restore(data, DummyModel),
        'restore() with Model Factory returns')
      assert.equal(list.length, data.length, 'restore() restores the length')
      assert.equal(list.get(0).data, 'asd5', 'restore() constructs the object')
      assert.equal(list.get(1).data, 'asd3', 'restore() constructs the object')
      assert.equal(list.get(2).data, 'asd4', 'restore() constructs the object')
      assert.equal(list.get(3).data, 'asd2', 'restore() constructs the object')
      assert.equal(list.get(4).data, 'asd3', 'restore() constructs the object')
      assert.equal(list.get(5).data, 'asd1', 'restore() constructs the object')
    })
  }
})
