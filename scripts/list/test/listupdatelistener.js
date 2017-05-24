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
    var ListModel, ListUpdateListener;

    ListModel = getModule('list/listmodel');
    ListUpdateListener = getModule('list/listupdatelistener');

    QUnit.test('ListUpdateListener', function (assert) {
      var list, listener, ref;

      list = new ListModel();
      list.push(1);

      /*
       * Test new-constructed instances
       */
      ref = 0;
      listener = new ListUpdateListener(list, function(data) {
        if (ref === 0) {
          assert.equal(this, list, 'callback "this" is the list');
        }
        ref += 1;
      });

      assert.ok(listener, 'construction via "new" works');
      assert.equal(ref, 0, 'callback is not called on construction');

      list.push(2);
      assert.equal(ref, 1, 'callback is called on push');
      list.insert(0, 3);
      assert.equal(ref, 2, 'callback is called on insert');
      list.pop();
      assert.equal(ref, 3, 'callback is called on pop');
      list.remove(0);
      assert.equal(ref, 4, 'callback is called on remove');
      list.erase(1);
      assert.equal(ref, 5, 'callback is called on erase');

      list.clear();
      assert.equal(ref, 6, 'callback is called on clear');

      listener.destroy();

      list.push(5);
      assert.equal(ref, 6, 'listener is unregistered on destroy');

      /*
       * Test bind()-constructed instances
       */
      ref = 0;
      ListUpdateListener.bind(list, function() {
        if (ref === 0) {
          assert.equal(this, list, 'callback "this" is the list');
        }
        ref += 1;
      });

      assert.ok(listener, 'construction via "bind()" works');
      assert.equal(ref, 0, 'callback is not called on bind-construction');

      list.push(2);
      assert.equal(ref, 1, 'callback is called on push');
      list.insert(0, 3);
      assert.equal(ref, 2, 'callback is called on insert');
      list.pop();
      assert.equal(ref, 3, 'callback is called on pop');
      list.remove(0);
      assert.equal(ref, 4, 'callback is called on remove');
      list.erase(5);
      assert.equal(ref, 5, 'callback is called on erase');

      list.clear();
      assert.equal(ref, 6, 'callback is called on clear');
    });
  };
});
