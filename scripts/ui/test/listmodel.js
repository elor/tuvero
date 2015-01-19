/**
 * Unit tests for ListModel
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var ListModel;

    ListModel = getModule('ui/listmodel');

    // TODO test the emitted events

    QUnit.test("ListModel tests", function () {
      var list, obj;

      list = new ListModel();

      QUnit.equal(list.length, 0, 'initial size is 0');
      QUnit.deepEqual(list.asArray(), [], 'asArray returns empty array');

      list.push(2);
      QUnit.deepEqual(list.asArray(), [ 2 ], 'first push');

      list.push(4);
      QUnit.deepEqual(list.asArray(), [ 2, 4 ], 'second push');

      list.insert(0, 1);
      QUnit.deepEqual(list.asArray(), [ 1, 2, 4 ], 'insert at front');

      list.insert(3, 5);
      QUnit.deepEqual(list.asArray(), [ 1, 2, 4, 5 ], 'insert at end');

      list.insert(2, 3);
      QUnit.deepEqual(list.asArray(), [ 1, 2, 3, 4, 5 ], 'insert inbetween');

      QUnit.equal(list.length, 5, 'length after all inserts');

      QUnit.equal(list.get(0), 1, 'get 1');
      QUnit.equal(list.get(1), 2, 'get 2');
      QUnit.equal(list.get(2), 3, 'get 3');
      QUnit.equal(list.get(3), 4, 'get 4');
      QUnit.equal(list.get(4), 5, 'get 5');

      QUnit.equal(list.get(-1), undefined, 'get out of bounds (index -1)');
      QUnit.equal(list.get(5), undefined, 'get slightly out of bounds (index 5)');
      QUnit.equal(list.get(1234567890), undefined, 'get wildly out of bounds (index 1234567890)');

      QUnit.equal(list.indexOf(1), 0, 'indexOf: first element');
      QUnit.equal(list.indexOf(5), 4, 'indexOf: last element');
      QUnit.equal(list.indexOf('unavailable'), -1, 'indexOf: unavailable element');

      QUnit.equal(list.remove(0), 1, 'remove returns the removed object');
      QUnit.deepEqual(list.asArray(), [ 2, 3, 4, 5 ], 'remove at front');
      QUnit.equal(list.length, 4, 'length after remove');

      QUnit.equal(list.remove(3), 5, 'remove returns the removed object');
      QUnit.deepEqual(list.asArray(), [ 2, 3, 4 ], 'remove at back');
      QUnit.equal(list.length, 3, 'length after remove');

      QUnit.equal(list.remove(1), 3, 'remove returns the removed object');
      QUnit.deepEqual(list.asArray(), [ 2, 4 ], 'remove inbetween');
      QUnit.equal(list.length, 2, 'length after remove');

      QUnit.equal(list.remove(123), undefined, 'remove out of bounds does nothing');
      QUnit.deepEqual(list.asArray(), [ 2, 4 ], 'remove out of bounds');
      QUnit.equal(list.length, 2, 'length after remove out of bounds');

      list.set(1, 123);
      QUnit.equal(list.length, 2, 'set does not change length');
      QUnit.deepEqual(list.asArray(), [ 2, 123 ], 'list.set actually sets the value');

      QUnit.equal(list.set(123, 321), undefined, "set out of bounds doesn't to anything");
      QUnit.deepEqual(list.asArray(), [ 2, 123 ], "set out of bounds really doesn't to anything");

      list.clear();

      QUnit.equal(list.length, 0, 'cleared size is 0');
      QUnit.deepEqual(list.asArray(), [], 'asArray returns empty array after clear');

      obj = {
        tmp : true,
        tmp_long : 'very much so',
      };

      list.push(obj);

      QUnit.equal(list.get(0), obj, 'objects are directly referenced, not copied');
      QUnit.equal(list.pop(), obj, 'pop returns the popped object');

      QUnit.equal(list.length, 0, 'popped size is 0');
      QUnit.deepEqual(list.asArray(), [], 'asArray returns empty array after pop');

    });
  };
});
