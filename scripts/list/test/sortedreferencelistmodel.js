/**
 * Unit tests
 *
 * TODO test emitted events
 *
 * TODO test whether the sorted lists are readonly
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, SortedReferenceListModel, ListModel;

    extend = getModule('lib/extend');
    SortedReferenceListModel = getModule('list/sortedreferencelistmodel');
    ListModel = getModule('list/listmodel');

    QUnit.test('SortedReferenceListModel', function (assert) {
      var list, sorted, sortfunc, success;

      assert.ok(extend.isSubclass(SortedReferenceListModel, ListModel),
          'SortedReferenceListModel is subclass of ReferenceListModel');

      list = new ListModel();

      success = false;
      try {
        sorted = new SortedReferenceListModel();
      } catch (e) {
        success = true;
      }

      assert.ok(success, 'empty construction fails');

      sorted = new SortedReferenceListModel(list);
      assert.ok(sorted, 'proper construction');
      assert.equal(sorted.length, 0, 'initial sorted list is empty');

      list.push(5);

      assert.equal(sorted.length, 1,
          'pushing to the original list is mirrored by sorted list');
      assert.deepEqual(sorted.asArray(), [5], 'element has been appended');

      list.push(2);
      list.push(1);
      list.push(4);
      assert.deepEqual(sorted.asArray(), [1, 2, 4, 5],
          'appended elements are inserted in sort order');

      list.remove(1);
      assert.deepEqual(sorted.asArray(), [1, 4, 5],
          'correct element is removed when removing from original list');

      list.insert(2, 3);
      assert.deepEqual(sorted.asArray(), [1, 3, 4, 5],
          'sorting arbitrary insertions into the original list ');

      list.clear();
      assert.equal(sorted.length, 0, 'clear() is mirrored');

      list = new ListModel([4, 1, 2, 6, 53]);
      sorted = new SortedReferenceListModel(list);
      assert.deepEqual(sorted.asArray(), [1, 2, 4, 6, 53],
          'pre-initialized list is sorted on construction');

      list = new ListModel(['Erik', 'Kai', 'Fabe']);
      sorted = new SortedReferenceListModel(list);
      assert.deepEqual(sorted.asArray(), ['Erik', 'Fabe', 'Kai'],
          'strings are sorted');

      sorted = new SortedReferenceListModel(list,
          SortedReferenceListModel.descending);
      assert.deepEqual(sorted.asArray(), ['Kai', 'Fabe', 'Erik'],
          'descending order works, too');

      // descending order, even first
      sortfunc = function(a, b) {
        return ((a % 2) - (b % 2)) || (b - a);
      };

      list = new ListModel();
      sorted = new SortedReferenceListModel(list, sortfunc);

      list.push(1);
      list.push(4);
      list.push(3);
      list.push(8);
      list.push(100);
      list.push(3);
      list.push(4);
      list.push(5);
      assert.deepEqual(sorted.asArray(), [100, 8, 4, 4, 5, 3, 3, 1],
          'arbitrary sort functions are accepyted');

      sortfunc = function() {
        return 0;
      };
      sorted = new SortedReferenceListModel(list, sortfunc);
      assert.deepEqual(sorted.asArray(), list.asArray(),
          'sortfunction with zeroing sortfunction: '
              + 'add element in list order on construction');

      list.insert(2, 13);
      assert.deepEqual(sorted.asArray(), [1, 4, 3, 8, 100, 3, 4, 5, 13],
          'zeroing sortfunction: '
              + 'insertion order is not the initial list order!');

      /*
       * 'unique' parameter
       */

      sorted = new SortedReferenceListModel(list, undefined, false);
      assert.deepEqual(sorted.asArray(), [1, 3, 3, 4, 4, 5, 8, 13, 100],
          'non-"unique" mode');

      sorted = new SortedReferenceListModel(list, undefined, true);
      assert.deepEqual(sorted.asArray(), [1, 3, 4, 5, 8, 13, 100],
          '"unique" mode');

      list.remove(3);
      assert.deepEqual(sorted.asArray(), [1, 4, 5, 8, 13, 100],
          'CAREFUL: remove() removes ALL references, not just the last one');
    });
  };
});
