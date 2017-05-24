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
    var ListModel, UniqueListModel, extend;

    ListModel = getModule('list/listmodel');
    UniqueListModel = getModule('core/uniquelistmodel');
    extend = getModule('lib/extend');

    QUnit.test('UniqueListModel', function (assert) {
      var list;

      assert.ok(extend.isSubclass(UniqueListModel, ListModel),
          'UniqueListModel is subclass of ListModel');

      list = new UniqueListModel();

      assert.equal(list.push(1), 1, 'push works');
      assert.equal(list.push(2), 2, 'push works');
      assert.equal(list.push(1), undefined, 'push aborts');
      assert.equal(list.push(3), 3, 'push works');
      assert.equal(list.push(1), undefined, 'push aborts');
      assert.equal(list.push(5), 4, 'push works');
      assert.equal(list.push(1), undefined, 'push aborts');
      assert.deepEqual(list.asArray(), [1, 2, 3, 5], 'push() inserts once');

      assert.equal(list.set(2, 1), undefined, 'set aborts');
      assert.deepEqual(list.asArray(), [1, 2, 3, 5], 'set() does not remove');

      assert.equal(list.set(2, 4), 4, 'set works');
      assert.deepEqual(list.asArray(), [1, 2, 4, 5], 'set() still works');

      assert.equal(list.insert(2, 1), undefined, 'insert aborts');
      assert.deepEqual(list.asArray(), [1, 2, 4, 5], 'insert() doesnt insert');

      assert.equal(list.insert(2, 3), 3, 'insert still works');
      assert.deepEqual(list.asArray(), [1, 2, 3, 4, 5], 'insert() still works');
    });
  };
});
