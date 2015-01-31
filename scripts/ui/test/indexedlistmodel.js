/**
 * Unit tests for IndexedListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, IndexedListModel, IndexedModel, ListModel;

    extend = getModule('lib/extend');
    IndexedListModel = getModule('ui/indexedlistmodel');
    ListModel = getModule('ui/listmodel');
    IndexedModel = getModule('ui/indexedmodel');

    QUnit.test('IndexedListModel tests', function() {
      var list;

      QUnit.ok(extend.isSubclass(IndexedListModel, ListModel), 'IndexedListModel is subclass of ListModel');

      list = new IndexedListModel();

      list.push(new IndexedModel());
      list.push(new IndexedModel());
      list.push(new IndexedModel());
      QUnit.equal(list.get(0).getID(), 0, 'push into empty indexed list sets the proper id');
      QUnit.equal(list.get(1).getID(), 1, 'push into empty indexed list sets the proper id');
      QUnit.equal(list.get(2).getID(), 2, 'push into empty indexed list sets the proper id');

      list.pop();
      QUnit.equal(list.get(0).getID(), 0, 'pop does not affect any indices');
      QUnit.equal(list.get(1).getID(), 1, 'pop does not affect any indices');

      list.push(new IndexedModel());
      list.push(new IndexedModel());

      list.remove(0);
      QUnit.equal(list.get(0).getID(), 0, 'remove(0) adjusts all following indices');
      QUnit.equal(list.get(1).getID(), 1, 'remove(0) adjusts all following indices');
      QUnit.equal(list.get(2).getID(), 2, 'remove(0) adjusts all following indices');

      list.remove(1);
      QUnit.equal(list.get(0).getID(), 0, 'remove(1) adjusts all following indices');
      QUnit.equal(list.get(1).getID(), 1, 'remove(2) adjusts all following indices');
    });
  };
});
