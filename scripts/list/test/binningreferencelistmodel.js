/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, BinningReferenceListModel, ListModel

    extend = getModule('lib/extend')
    BinningReferenceListModel = getModule('list/binningreferencelistmodel')
    ListModel = getModule('list/listmodel')

    QUnit.test('BinningReferenceListModel', function (assert) {
      var success, binlist, bin, list, binningFunction

      assert.ok(extend.isSubclass(BinningReferenceListModel, ListModel),
        'BinningReferenceListModel is subclass of ListModel')

      success = false
      try {
        binlist = new BinningReferenceListModel()
      } catch (e) {
        success = true
      }
      assert.ok(success, 'empty construction throws an error')

      success = false
      list = new ListModel()
      try {
        binlist = new BinningReferenceListModel(list)
      } catch (e) {
        success = true
      }
      assert.ok(success, 'missing binning function throws an error')

      success = false
      binningFunction = function (num) {
        return num % 10
      }
      try {
        binlist = new BinningReferenceListModel(undefined)
      } catch (e) {
        success = true
      }
      assert.ok(success, 'missing bin list throws an error')

      binlist = new BinningReferenceListModel(list, binningFunction)
      assert.ok(binlist, 'proper construction')
      assert.equal(binlist.length, 0, 'initial length is 0')

      list.push(4)
      assert.equal(binlist.length, 1, "there's one bin now")
      assert.equal(binlist.getBinName(0), 4, 'bin has correct name')

      bin = binlist.getBin(4)
      assert.equal(bin.length, 1, 'bin contains an element')
      assert.deepEqual(bin.asArray(), [4], 'bin 4 contains the number 4')

      list.push(14)
      assert.equal(binlist.length, 1, "there's still only one bin")
      assert.deepEqual(bin.asArray(), [4, 14], 'bin 4 contains the number 14')

      list.insert(0, 24)
      assert.deepEqual(bin.asArray(), [24, 4, 14],
        'order of original list is preserved')

      list.push(1)
      list.push(12)
      list.push(53)

      assert.equal(binlist.length, 4, 'More insertions: 4 bins')

      list.pop()
      assert.equal(binlist.length, 3,
        'only 3 bins after the removal of a unique number')

      list = new ListModel([4, 1, 2, 53, 16, 5, 8, 9, 0, 7])
      binlist = new BinningReferenceListModel(list, binningFunction)
      assert.equal(binlist.length, 10,
        'auto-initialization from existing values')
      assert.equal(binlist.getBin(3).get(0), 53,
        'binlist contains actual values, not indices')
    })
  }
})
