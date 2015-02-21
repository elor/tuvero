/**
 * unit tests
 * 
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * Various Matrix Tests
 */
define(function() {
  return function(QUnit, getModule) {
    var MatrixModel, SymmetricMatrixModel, extend;

    MatrixModel = getModule('core/matrixmodel');
    SymmetricMatrixModel = getModule('core/symmetricmatrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('SymmetricMatrixModel', function() {
      // constructor validation
      var a;

      QUnit.ok(extend.isSubclass(SymmetricMatrixModel, MatrixModel),
          'SymmetricMatrixModel is subclass of MatrixModel');

      a = new SymmetricMatrixModel(5);

      QUnit.equal(a.length, 5, 'length at initialization is accepted');

      QUnit.equal(a.set(0, 4, 5), a, 'set() above the main diagonal works');
      QUnit.equal(a.get(0, 4), 5, 'get() confirms the written value');
      QUnit.equal(a.get(4, 0), 5, 'get() confirms the symmetric mapping');

      QUnit.equal(a.set(2, 2, 5), a, 'set() on the main diagonal works');
      QUnit.equal(a.get(2, 2), 5, 'get() confirms the main diagonal value');

      QUnit.equal(a.set(4, 3, 3), a, 'set() below main diagonal works');
      QUnit.equal(a.get(4, 3), 3, 'get() confirms the value');
      QUnit.equal(a.get(3, 4), 3, 'get() confirms the symmetric value');
    });
  };
});
