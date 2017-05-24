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
    var DelegateMatrix;

    TransposeSumMatrix = getModule('math/transposesummatrix');
    DelegateMatrix = getModule('math/delegatematrix');
    MatrixModel = getModule('math/matrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('TransposeSumMatrix', function (assert) {
      // constructor validation
      var a, m;

      assert.ok(extend.isSubclass(TransposeSumMatrix, DelegateMatrix),
          'TransposeSumMatrix is a DelegateMatrix subclass');

      m = new MatrixModel(5);
      a = new TransposeSumMatrix(m);
      [0, 1, 2, 3, 4].forEach(function(row) {
        [0, 1, 2, 3, 4].forEach(function(col) {
          m.set(row, col, 12 - (row * a.length + col));
        });
      });

      assert.equal(a.get(0, 0), 24, 'get() on diagonal returns a twice value');
      assert.equal(a.get(3, 2), -6, 'get() returns the transpose-sum');
      assert.equal(a.get(1, 0), 18, 'get() returns the transpose-sum');
      assert.equal(a.get(2, 2), 0, 'get() returns the transpose-sum');
      assert.equal(a.get(4, 4), -24, 'get() returns the transpose-sum');

      assert.equal(a.get(-1, 2), undefined, 'get() out of bounds (row low)');
      assert.equal(a.get(2, -9), undefined, 'get() out of bounds (col low)');
      assert.equal(a.get(5, 3), undefined, 'get() out of bounds (row high)');
      assert.equal(a.get(3, 7531), undefined, 'get() out of bounds (col high)');
    });
  };
});
