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

    TransposeDifferenceMatrix = getModule('math/transposedifferencematrix');
    DelegateMatrix = getModule('math/delegatematrix');
    MatrixModel = getModule('math/matrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('TransposeDifferenceMatrix', function() {
      // constructor validation
      var a, m;

      QUnit.ok(extend.isSubclass(TransposeDifferenceMatrix, DelegateMatrix),
          'TransposeDifferenceMatrix is a DelegateMatrix subclass');

      m = new MatrixModel(5);
      a = new TransposeDifferenceMatrix(m);
      [0, 1, 2, 3, 4].forEach(function(row) {
        [0, 1, 2, 3, 4].forEach(function(col) {
          m.set(row, col, 12 - (row * a.length + col));
        });
      });

      QUnit.equal(a.get(0, 0), 0, 'get() on diagonal returns 0');
      QUnit.equal(a.get(3, 2), -4, 'get() returns the transpose-difference');
      QUnit.equal(a.get(0, 1), 4, 'get() returns the transpose-difference');
      QUnit.equal(a.get(2, 2), 0, 'get() on diagonal returns 0');
      QUnit.equal(a.get(4, 0), -16, 'get() returns the transpose-difference');
      QUnit.equal(a.get(0, 4), 16, 'get() is antisymmetric');

      QUnit.equal(a.get(-1, 2), undefined, 'get() out of bounds (row low)');
      QUnit.equal(a.get(2, -9), undefined, 'get() out of bounds (col low)');
      QUnit.equal(a.get(5, 3), undefined, 'get() out of bounds (row high)');
      QUnit.equal(a.get(3, 7531), undefined, 'get() out of bounds (col high)');
    });
  };
});
