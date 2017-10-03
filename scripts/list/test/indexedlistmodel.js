/**
 * Unit tests for IndexedListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, IndexedListModel, IndexedModel, ListModel;

    extend = getModule('lib/extend');
    IndexedListModel = getModule('list/indexedlistmodel');
    ListModel = getModule('list/listmodel');
    IndexedModel = getModule('list/indexedmodel');

    QUnit.test('IndexedListModel', function (assert) {
      var list;

      assert.ok(extend.isSubclass(IndexedListModel, ListModel),
          'IndexedListModel is subclass of ListModel');

      list = new IndexedListModel();

      list.push(new IndexedModel());
      list.push(new IndexedModel());
      list.push(new IndexedModel());
      assert.equal(list.get(0).getID(), 0,
          'push into empty indexed list sets the proper id');
      assert.equal(list.get(1).getID(), 1,
          'push into empty indexed list sets the proper id');
      assert.equal(list.get(2).getID(), 2,
          'push into empty indexed list sets the proper id');

      list.pop();
      assert.equal(list.get(0).getID(), 0, 'pop does not affect any indices');
      assert.equal(list.get(1).getID(), 1, 'pop does not affect any indices');

      list.push(new IndexedModel());
      list.push(new IndexedModel());

      list.remove(0);
      assert.equal(list.get(0).getID(), 0,
          'remove(0) adjusts all following indices');
      assert.equal(list.get(1).getID(), 1,
          'remove(0) adjusts all following indices');
      assert.equal(list.get(2).getID(), 2,
          'remove(0) adjusts all following indices');

      list.remove(1);
      assert.equal(list.get(0).getID(), 0,
          'remove(1) adjusts all following indices');
      assert.equal(list.get(1).getID(), 1,
          'remove(2) adjusts all following indices');

      list.clear();
      assert.equal(list.length, 0, 'clearing a non-empty list does not throw');

      list = new IndexedListModel();
      list.clear();
      assert.equal(list.length, 0, 'clearing an empty list does not throw');
    });
  };
});
