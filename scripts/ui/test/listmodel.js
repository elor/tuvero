/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var ListModel;

    ListModel = getModule('ui/listmodel');

    // TODO test the emitted events

    QUnit.test('ListModel tests', function() {
      var list, obj, i, ret, res, listener;

      listener = {
        reset: function() {
          listener.length = 0;
          listener.insertions = 0;
          listener.removals = 0;
        },
        onresize: function(emitter) {
          listener.length = emitter.length;
        },
        oninsert: function() {
          listener.insertions += 1;
        },
        onremove: function() {
          listener.removals += 1;
        },
        emitters: []
      };
      listener.reset();

      list = new ListModel();
      list.registerListener(listener);

      QUnit.equal(list.length, 0, 'initial size is 0');
      QUnit.deepEqual(list.asArray(), [], 'asArray returns empty array');

      list.push(2);
      QUnit.deepEqual(list.asArray(), [2], 'first push');
      QUnit.equal(list.length, 1, 'size after first push is 1');
      QUnit.equal(listener.length, 1, 'resize event fired on push');
      QUnit.equal(listener.insertions, 1, 'insert event fired on push');

      list.push(4);
      QUnit.deepEqual(list.asArray(), [2, 4], 'second push');
      QUnit.equal(list.length, 2, 'size after second push is 2');
      QUnit.equal(listener.length, 2, 'resize event fired on push');

      list.insert(0, 1);
      QUnit.deepEqual(list.asArray(), [1, 2, 4], 'insert at front');
      QUnit.equal(list.length, 3, 'size after insert is 3');
      QUnit.equal(listener.length, 3, 'resize event fired on insert');
      QUnit.equal(listener.insertions, 3, 'insert event fired on insert');

      list.insert(3, 5);
      QUnit.deepEqual(list.asArray(), [1, 2, 4, 5], 'insert at end');

      list.insert(2, 3);
      QUnit.deepEqual(list.asArray(), [1, 2, 3, 4, 5], 'insert inbetween');

      QUnit.equal(list.length, 5, 'length after all inserts');
      QUnit.equal(listener.insertions, 5,
          'number of fired insert events matches number of insertions');

      QUnit.equal(list.get(0), 1, 'get 1');
      QUnit.equal(list.get(1), 2, 'get 2');
      QUnit.equal(list.get(2), 3, 'get 3');
      QUnit.equal(list.get(3), 4, 'get 4');
      QUnit.equal(list.get(4), 5, 'get 5');

      QUnit.equal(list.get(-1), undefined, 'get out of bounds (index -1)');
      QUnit.equal(list.get(5), undefined,
          'get slightly out of bounds (index 5)');
      QUnit.equal(list.get(1234567890), undefined,
          'get wildly out of bounds (index 1234567890)');

      QUnit.equal(list.indexOf(1), 0, 'indexOf: first element');
      QUnit.equal(list.indexOf(5), 4, 'indexOf: last element');
      QUnit.equal(list.indexOf('unavailable'), -1,
          'indexOf: unavailable element');

      QUnit.equal(list.remove(0), 1, 'remove returns the removed object');
      QUnit.deepEqual(list.asArray(), [2, 3, 4, 5], 'remove at front');
      QUnit.equal(list.length, 4, 'length after remove');
      QUnit.equal(listener.length, 4, 'resize event fired on remove');
      QUnit.equal(listener.removals, 1, 'remove event fired on remove');

      QUnit.equal(list.pop(3), 5, 'pop returns the removed object');
      QUnit.deepEqual(list.asArray(), [2, 3, 4], 'pop (remove at back)');
      QUnit.equal(list.length, 3, 'length after remove');
      QUnit.equal(listener.removals, 2, 'remove event fired on pop');

      QUnit.equal(list.remove(1), 3, 'remove returns the removed object');
      QUnit.deepEqual(list.asArray(), [2, 4], 'remove inbetween');
      QUnit.equal(list.length, 2, 'length after remove');

      QUnit.equal(list.remove(123), undefined,
          'remove out of bounds does nothing');
      QUnit.deepEqual(list.asArray(), [2, 4], 'remove out of bounds');
      QUnit.equal(list.length, 2, 'length after remove out of bounds');

      list.set(1, 123);
      QUnit.equal(list.length, 2, 'set does not change length');
      QUnit.deepEqual(list.asArray(), [2, 123],
          'list.set actually sets the value');
      QUnit.equal(listener.length, 2,
          'resize event balanced on set() (may have been fired twice)');

      listener.reset();

      QUnit.equal(list.set(123, 321), undefined,
          "set out of bounds doesn't to anything");
      QUnit.deepEqual(list.asArray(), [2, 123],
          "set out of bounds really doesn't to anything");
      QUnit.equal(listener.insertions, 0,
          "set out of bounds doesn't fire insert event");
      QUnit.equal(listener.removals, 0,
          "set out of bounds doesn't fire remove event");

      list.clear();
      QUnit.equal(list.length, 0, 'list length is 0 after clear');
      QUnit.equal(listener.length, 0, 'resize event fired on clear)');
      QUnit.equal(listener.removals, 2, 'clear fires remove events');

      list.push(4);
      list.push(3);
      list.push(2);
      list.push(1);

      i = 0;

      ret = list.map(function(num, index, thelist) {
        QUnit.equal(this, 5, 'map(): this === thisArg, ' + index);
        QUnit.equal(index, i, 'map(): iterating in ascending order, ' + index);
        QUnit.equal(num, list.length - index,
            'first argument is the list content' + index);
        QUnit.equal(thelist, list,
            'map(): third function argument is the list, ' + index);
        i += 1;
        return num * num;
      }, 5);

      res = [16, 9, 4, 1];
      QUnit.deepEqual(ret, res, 'map(): return value is preserved');

      list.clear();

      QUnit.equal(list.length, 0, 'cleared size is 0');
      QUnit.deepEqual(list.asArray(), [],
          'asArray returns empty array after clear');

      obj = {
        tmp: true,
        tmpLong: 'very much so'
      };

      list.push(obj);

      QUnit.equal(list.get(0), obj,
          'objects are directly referenced, not copied');
      QUnit.equal(list.pop(), obj, 'pop returns the popped object directly');

      QUnit.equal(list.length, 0, 'popped size is 0');
      QUnit.deepEqual(list.asArray(), [],
          'asArray returns empty array after pop');

    });
  };
});
