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
    var MatrixModel, TriangleMatrixModel, extend;

    MatrixModel = getModule('math/matrixmodel');
    TriangleMatrixModel = getModule('core/trianglematrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('TriangleMatrixModel', function() {
      // constructor validation
      var a;

      QUnit.ok(extend.isSubclass(TriangleMatrixModel, MatrixModel),
          'TriangleMatrixModel is subclass of MatrixModel');

      a = new TriangleMatrixModel(5);

      QUnit.equal(a.length, 5, 'length at initialization is accepted');

      QUnit.equal(a.set(0, 4, 5), undefined,
          'set() above the main diagonal aborts, leaving the value at 0');
      QUnit.equal(a.get(0, 4), 0, 'get() confirms the zero-value');

      QUnit.equal(a.set(2, 2, 5), a, 'set() on the main diagonal works');
      QUnit.equal(a.get(2, 2), 5, 'get() confirms the main diagonal value');

      QUnit.equal(a.set(4, 3, 3), a, 'set() below main diagonal works');
      QUnit.equal(a.get(4, 3), 3, 'get() confirms the value');
    });
  };
});
