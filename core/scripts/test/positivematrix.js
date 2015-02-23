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

    PositiveMatrix = getModule('core/positivematrix');
    DelegateMatrix = getModule('core/delegatematrix');
    MatrixModel = getModule('core/matrixmodel');
    extend = getModule('lib/extend');

    QUnit.test('PositiveMatrix', function() {
      // constructor validation
      var a, m, state;

      QUnit.ok(extend.isSubclass(PositiveMatrix, DelegateMatrix),
          'PositiveMatrix is a DelegateMatrix subclass');

      m = new MatrixModel(5);
      a = new PositiveMatrix(m);
      [0, 1, 2, 3, 4].forEach(function(row) {
        [0, 1, 2, 3, 4].forEach(function(col) {
          m.set(row, col, 12 - (row * a.length + col));
        });
      });

      QUnit.equal(a.get(0, 0), 12, 'get() returns the positive value');
      QUnit.equal(a.get(3, 2), 0, 'get() returns the positive value');
      QUnit.equal(a.get(1, 0), 7, 'get() returns the positive value');
      QUnit.equal(a.get(2, 2), 0, 'get() returns the positive value');
      QUnit.equal(a.get(4, 4), 0, 'get() returns the positive value');

      QUnit.equal(a.get(-1, 2), undefined, 'get() out of bounds (row low)');
      QUnit.equal(a.get(2, -9), undefined, 'get() out of bounds (col low)');
      QUnit.equal(a.get(5, 3), undefined, 'get() out of bounds (row high)');
      QUnit.equal(a.get(3, 7531), undefined, 'get() out of bounds (col high)');
    });
  };
});
