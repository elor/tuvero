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
    var extend, LengthModel, ValueModel, ListModel;

    extend = getModule('lib/extend');
    ListModel = getModule('list/listmodel');
    LengthModel = getModule('core/lengthmodel');
    ValueModel = getModule('core/valuemodel');

    QUnit.test('LengthModel', function() {
      var length, list, success;
      QUnit.ok(extend.isSubclass(LengthModel, ValueModel),
          'LengthModel is subclass of ValueModel');

      success = false;
      try {
        new LengthModel();
      } catch (e) {
        success = true;
      }

      QUnit.ok(success, 'empty construction fails');

      list = new ListModel([1, 2, 3]);

      length = new LengthModel(list);

      QUnit.equal(length.get(), 3,
          'constructor reads the initial length of the list');

      list.pop();
      QUnit.equal(length.get(), 2, 'list.pop() is mirrored');

      list.push('asd');
      QUnit.equal(length.get(), 3, 'list.push() is mirrored');

      list.clear();
      QUnit.equal(length.get(), 0, 'list.clear() is mirrored');

    });
  };
});
