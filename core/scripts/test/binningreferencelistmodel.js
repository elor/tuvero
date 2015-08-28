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
    var extend, BinningReferenceListModel, ListModel;

    extend = getModule('lib/extend');
    BinningReferenceListModel = getModule('core/binningreferencelistmodel');
    ListModel = getModule('core/listmodel');

    QUnit.test('BinningReferenceListModel', function() {
      var success, binlist, bin, list, binningFunction;

      QUnit.ok(extend.isSubclass(BinningReferenceListModel, ListModel),
          'BinningReferenceListModel is subclass of ListModel');

      success = false;
      try {
        binlist = new BinningReferenceListModel();
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'empty construction throws an error');

      success = false;
      list = new ListModel();
      try {
        binlist = new BinningReferenceListModel(list);
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'missing binning function throws an error');

      success = false;
      binningFunction = function(num) {
        return num % 10;
      };
      try {
        binlist = new BinningReferenceListModel(undefined);
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'missing bin list throws an error');

      binlist = new BinningReferenceListModel(list, binningFunction)
      QUnit.ok(binlist, 'proper construction');
      QUnit.equal(binlist.length, 0, 'initial length is 0');

      list.push(4);
      QUnit.equal(binlist.length, 1, "there's one bin now");
      QUnit.equal(binlist.getBinName(0), 4, 'bin has correct name');

      bin = binlist.getBin(4);
      QUnit.equal(bin.length, 1, 'bin contains an element');
      QUnit.deepEqual(bin.asArray(), [4], 'bin 4 contains the number 4');

      list.push(14);
      QUnit.equal(binlist.length, 1, "there's still only one bin");
      QUnit.deepEqual(bin.asArray(), [4, 14], 'bin 4 contains the number 14');

      list.insert(0, 24);
      QUnit.deepEqual(bin.asArray(), [24, 4, 14],
          'order of original list is preserved');

      list.push(1);
      list.push(12);
      list.push(53);

      QUnit.equal(binlist.length, 4, "More insertions: 4 bins");

      list.pop();
      QUnit.equal(binlist.length, 3,
          "only 3 bins after the removal of a unique number");

      list = new ListModel([4, 1, 2, 53, 16, 5, 8, 9, 0, 7]);
      binlist = new BinningReferenceListModel(list, binningFunction);
      QUnit.equal(binlist.length, 10,
          'auto-initialization from existing values');
      QUnit.equal(binlist.getBin(3).get(0), 53,
          'binlist contains actual values, not indices');

    });
  };
});
