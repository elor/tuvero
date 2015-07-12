/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, OrderListModel, ListModel;

    extend = getModule('lib/extend');
    OrderListModel = getModule('core/orderlistmodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('OrderListModel', function() {
      var list, order, ref;
      QUnit.ok(extend.isSubclass(OrderListModel, ListModel),
          'OrderListModel is subclass of ListModel');

      list = new OrderListModel();
      QUnit.equal(list.length, 0, 'initial length is 0');
      QUnit.deepEqual(list.asArray(), [], 'initial list is empty');

      list.enforceOrder([4, 3, 1, 0, 2]);

      QUnit.equal(list.length, 5, 'length gets adjusted automatically');
      QUnit.deepEqual(list.asArray(), [3, 2, 4, 1, 0],
          'elements get ordered properly');

      list.enforceOrder([6, 3, 1, 5, 7, 2, 0, 4]);
      QUnit.equal(list.length, 8, 'length gets adjusted automatically');
      QUnit.deepEqual(list.asArray(), [6, 2, 5, 1, 7, 3, 0, 4],
          'elements get ordered properly');

      list.enforceOrder([]);
      QUnit.equal(list.length, 0, 'length gets reduced automatically');
      QUnit.deepEqual(list.asArray(), [], 'elements get removed properly');

    });
  };
});
