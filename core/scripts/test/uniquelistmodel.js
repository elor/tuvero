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

    ListModel = getModule('core/listmodel');
    UniqueListModel = getModule('core/uniquelistmodel');
    extend = getModule('lib/extend');

    QUnit.test('UniqueListModel', function() {
      var list;

      QUnit.ok(extend.isSubclass(UniqueListModel, ListModel),
          'UniqueListModel is subclass of ListModel');

      list = new UniqueListModel();

      QUnit.equal(list.push(1), 1, 'push works');
      QUnit.equal(list.push(2), 2, 'push works');
      QUnit.equal(list.push(1), undefined, 'push aborts');
      QUnit.equal(list.push(3), 3, 'push works');
      QUnit.equal(list.push(1), undefined, 'push aborts');
      QUnit.equal(list.push(5), 4, 'push works');
      QUnit.equal(list.push(1), undefined, 'push aborts');
      QUnit.deepEqual(list.asArray(), [1, 2, 3, 5], 'push() inserts once');

      QUnit.equal(list.set(2, 1), undefined, 'set aborts');
      QUnit.deepEqual(list.asArray(), [1, 2, 3, 5], 'set() does not remove');

      QUnit.equal(list.set(2, 4), 4, 'set works');
      QUnit.deepEqual(list.asArray(), [1, 2, 4, 5], 'set() still works');

      QUnit.equal(list.insert(2, 1), undefined, 'insert aborts');
      QUnit.deepEqual(list.asArray(), [1, 2, 4, 5], 'insert() doesnt insert');

      QUnit.equal(list.insert(2, 3), 3, 'insert still works');
      QUnit.deepEqual(list.asArray(), [1, 2, 3, 4, 5], 'insert() still works');
    });
  };
});
