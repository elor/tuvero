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

    ListModel = getModule('core/listmodel');
    ListUpdateListener = getModule('core/listupdatelistener');

    QUnit.test('ListUpdateListener', function() {
      var list, listener, ref;

      list = new ListModel();
      list.push(1);

      /*
       * Test new-constructed instances
       */
      ref = 0;
      listener = new ListUpdateListener(list, function(data) {
        if (ref === 0) {
          QUnit.equal(this, list, 'callback "this" is the list');
        }
        ref += 1;
      });

      QUnit.ok(listener, 'construction via "new" works');
      QUnit.equal(ref, 0, 'callback is not called on construction');

      list.push(2);
      QUnit.equal(ref, 1, 'callback is called on push');
      list.insert(0, 3);
      QUnit.equal(ref, 2, 'callback is called on insert');
      list.pop();
      QUnit.equal(ref, 3, 'callback is called on pop');
      list.remove(0);
      QUnit.equal(ref, 4, 'callback is called on remove');
      list.erase(1);
      QUnit.equal(ref, 5, 'callback is called on erase');

      list.clear();
      QUnit.equal(ref, 6, 'callback is called on clear');

      listener.destroy();

      list.push(5);
      QUnit.equal(ref, 6, 'listener is unregistered on destroy');

      /*
       * Test bind()-constructed instances
       */
      ref = 0;
      ListUpdateListener.bind(list, function() {
        if (ref === 0) {
          QUnit.equal(this, list, 'callback "this" is the list');
        }
        ref += 1;
      });

      QUnit.ok(listener, 'construction via "bind()" works');
      QUnit.equal(ref, 0, 'callback is not called on bind-construction');

      list.push(2);
      QUnit.equal(ref, 1, 'callback is called on push');
      list.insert(0, 3);
      QUnit.equal(ref, 2, 'callback is called on insert');
      list.pop();
      QUnit.equal(ref, 3, 'callback is called on pop');
      list.remove(0);
      QUnit.equal(ref, 4, 'callback is called on remove');
      list.erase(5);
      QUnit.equal(ref, 5, 'callback is called on erase');

      list.clear();
      QUnit.equal(ref, 6, 'callback is called on clear');
    });
  };
});
