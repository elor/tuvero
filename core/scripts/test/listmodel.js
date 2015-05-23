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
    var ListModel, DummyModel;

    ListModel = getModule('core/listmodel');

    /*
     * dummy Model, which can be saved/restored for testing
     */
    DummyModel = function(optional) {
      if (optional) {
        this.data = "asd" + optional;
      }

      this.save = function() {
        return {
          d: this.data.replace(/^asd/, '')
        };
      };
      this.restore = function(data) {
        this.data = "asd" + data.d;
        return true;
      };
    };

    QUnit.test('ListModel', function() {
      var list, obj, i, ret, res, listener, data;

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

      list = new ListModel();
      list.push(3);
      list.push(2);
      list.push(3);
      list.push(4);
      list.push(3);
      list.push('3');

      QUnit.equal(list.erase(3), 3, 'erase() returns number of removals');
      QUnit.equal(list.indexOf(3), -1, 'erase removes all instances');
      QUnit.equal(list.length, 3, 'erase resizes the list');

      QUnit.equal(list.erase('notfound'), 0, 'erase() returns 0 if not found');

      list = new ListModel();
      list.makeReadonly();
      QUnit.equal(list.insert, undefined, 'makereadonly: insert() disabled');
      QUnit.equal(list.remove, undefined, 'makereadonly: remove() disabled');
      QUnit.equal(list.push, undefined, 'makereadonly: push() disabled');
      QUnit.equal(list.pop, undefined, 'makereadonly: pop() disabled');
      QUnit.equal(list.clear, undefined, 'makereadonly: clear() disabled');
      QUnit.equal(list.erase, undefined, 'makereadonly: erase() disabled');

      list = new ListModel();
      list.push(5);
      list.push(3);
      list.push(4);
      list.push(2);
      list.push(3);
      list.push(1);
      data = list.save();
      QUnit.ok(data, 'save() returns');
      QUnit.deepEqual(data, [5, 3, 4, 2, 3, 1],
          'save() uses a list representation for raw types');
      list = new ListModel();
      QUnit.ok(list.restore(data), 'restore() returns');
      QUnit.deepEqual(list.asArray(), [5, 3, 4, 2, 3, 1],
          'restore() restores the whole list');

      list.clear();
      list.push("Tuvero");
      list.push("is");
      list.push("awesome");
      data = list.save();
      QUnit.deepEqual(data, ["Tuvero", "is", "awesome"]);

      list.clear();
      list.push(new DummyModel(5));
      list.push(new DummyModel(3));
      list.push(new DummyModel(4));
      list.push(new DummyModel(2));
      list.push(new DummyModel(3));
      list.push(new DummyModel(1));
      data = list.save();
      QUnit.ok(data, 'save() calls save() recursively');
      QUnit.ok(data[0].d, 'save() really calls save() recursively');
      QUnit.ok(!data[0].save, 'save() really really calls save() recursively');

      list = new ListModel();
      QUnit.ok(list.restore(data, DummyModel), 'restore() returns');
      QUnit.equal(list.length, data.length, 'restore() restores the length');
      QUnit.equal(list.get(0).data, 'asd5', 'restore() constructs the object');
      QUnit.equal(list.get(1).data, 'asd3', 'restore() constructs the object');
      QUnit.equal(list.get(2).data, 'asd4', 'restore() constructs the object');
      QUnit.equal(list.get(3).data, 'asd2', 'restore() constructs the object');
      QUnit.equal(list.get(4).data, 'asd3', 'restore() constructs the object');
      QUnit.equal(list.get(5).data, 'asd1', 'restore() constructs the object');
    });
  };
});
