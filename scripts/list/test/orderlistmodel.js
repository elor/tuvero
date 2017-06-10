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
    OrderListModel = getModule('list/orderlistmodel');
    ListModel = getModule('list/listmodel');

    QUnit.test('OrderListModel', function (assert) {
      var list, ref;
      assert.ok(extend.isSubclass(OrderListModel, ListModel),
          'OrderListModel is subclass of ListModel');

      list = new OrderListModel();
      assert.equal(list.length, 0, 'initial length is 0');
      assert.deepEqual(list.asArray(), [], 'initial list is empty');

      ref = [4, 3, 1, 0, 2];
      list.enforceOrder(ref);
      assert.equal(list.length, 5, 'length gets adjusted automatically');
      assert.deepEqual(list.asArray(), ref,
          'elements get ordered properly');

      ref = [6, 3, 1, 5, 7, 2, 0, 4];
      list.enforceOrder(ref);
      assert.equal(list.length, 8, 'length gets adjusted automatically');
      assert.deepEqual(list.asArray(), ref,
          'elements get ordered properly');

      ref = [];
      list.enforceOrder(ref);
      assert.equal(list.length, 0, 'length gets reduced automatically');
      assert.deepEqual(list.asArray(), ref, 'elements get removed properly');

    });
  };
});
