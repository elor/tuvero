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
    TriangleMatrixModel = getModule('math/trianglematrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('TriangleMatrixModel', function (assert) {
      // constructor validation
      var a;

      assert.ok(extend.isSubclass(TriangleMatrixModel, MatrixModel),
          'TriangleMatrixModel is subclass of MatrixModel');

      a = new TriangleMatrixModel(5);

      assert.equal(a.length, 5, 'length at initialization is accepted');

      assert.equal(a.set(0, 4, 5), undefined,
          'set() above the main diagonal aborts, leaving the value at 0');
      assert.equal(a.get(0, 4), 0, 'get() confirms the zero-value');

      assert.equal(a.set(2, 2, 5), a, 'set() on the main diagonal works');
      assert.equal(a.get(2, 2), 5, 'get() confirms the main diagonal value');

      assert.equal(a.set(4, 3, 3), a, 'set() below main diagonal works');
      assert.equal(a.get(4, 3), 3, 'get() confirms the value');
    });
  };
});
