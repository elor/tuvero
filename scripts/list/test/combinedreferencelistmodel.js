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
    var extend, CombinedReferenceListModel, ListModel;

    extend = getModule('lib/extend');
    CombinedReferenceListModel = getModule('list/combinedreferencelistmodel');
    ListModel = getModule('list/listmodel');

    QUnit.test('CombinedReferenceListModel', function (assert) {
      var list1, list2, combined, success;
      assert.ok(extend.isSubclass(CombinedReferenceListModel, ListModel),
          'CombinedReferenceListModel is subclass of ListModel');

      success = false;
      try {
        combined = new CombinedReferenceListModel();
      } catch (e) {
        success = true;
      }
      assert.ok(success, 'empty construction currently fails');

      list1 = new ListModel();

      combined = new CombinedReferenceListModel(list1);
      assert.ok(combined, 'construction with a single list works');
      assert.equal(combined.length, 0, 'initial length is 0');

      list1.push(5);
      assert.equal(combined.length, 1, 'an element gets added');
      assert.deepEqual(combined.asArray(), [5], 'correct element was added');

      list1.insert(0, 1);
      assert.deepEqual(combined.asArray(), [1, 5], 'insertion is mirrored');

      list1.push(8);
      assert.deepEqual(combined.asArray(), [1, 5, 8], 'push is mirrored');

      list1.remove(1);
      assert.deepEqual(combined.asArray(), [1, 8], 'remove is mirrored');

      list1.pop();
      assert.deepEqual(combined.asArray(), [1], 'pop is mirrored');

      list1.clear();
      assert.deepEqual(combined.asArray(), [], 'clear is mirrored');

      list1 = new ListModel([1, 3, 5]);
      list2 = new ListModel([2, 4, 6]);
      combined = new CombinedReferenceListModel(list1, list2);
      assert.deepEqual(combined.asArray(), [1, 3, 5, 2, 4, 6],
          'multiple lists are appended');

      list2.insert(1, 13);
      assert.deepEqual(combined.asArray(), [1, 3, 5, 2, 13, 4, 6],
          'list offsets are correct');

      list1.clear();
      assert.deepEqual(combined.asArray(), [2, 13, 4, 6],
          'clear() shifts all following elements towards the front');

      list1 = new ListModel([1, 3, 5]);
      combined = new CombinedReferenceListModel(list1,
          new CombinedReferenceListModel(list1),
          new CombinedReferenceListModel(list1));
      assert.deepEqual(combined.asArray(), [1, 3, 5, 1, 3, 5, 1, 3, 5],
          'combining the same list three times');

      list1.push(7);
      assert.deepEqual(combined.asArray(), [1, 3, 5, 7, 1, 3, 5, 7, 1, 3, 5, 7],
          'pushing to the triply-combined list');
    });
  };
});
