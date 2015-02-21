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
    var MatrixModel;

    MatrixModel = getModule('core/matrixmodel');

    QUnit.test('MatrixModel', function() {
      // constructor validation
      var a, b;

      a = new MatrixModel();
      QUnit.equal(a.length, 0, 'empty size initialization');
      QUnit.equal(a.get(0, 0), undefined, 'get(0,0): out of bounds');

      a = new MatrixModel(5);
      QUnit.equal(a.length, 5, 'prefixed size initialization');
      QUnit.equal(a.get(0, 0), 0, 'get(0,0) === 0 on size-initialized array');
      QUnit.equal(a.get(-1, 1), undefined, 'get(-1,1): out of bounds');
      QUnit.equal(a.get(1, -1), undefined, 'get(1,-1): out of bounds');
      QUnit.equal(a.get(1, 5), undefined, 'get(1,5): out of bounds');
      QUnit.equal(a.get(5, 1), undefined, 'get(5,1): out of bounds');

      // extend
      a.resize();
      QUnit.equal(a.length, 5, 'resize() aborts on missing argument');

      a.resize(3);
      QUnit.equal(a.length, 3, 'resize() can shrink the array');

      a.resize(10);
      QUnit.equal(a.length, 10, 'resize() can extend the array');

      QUnit.equal(a.set(11, 5, 3), undefined,
          'set() out of bounds returns undefined');
      QUnit.equal(a.set(4, 5, 3), a, 'set() inside bounds returns this');

      QUnit.equal(a.get(4, 5), 3, 'get() returns the set value');
      a.resize(6);
      QUnit.equal(a.get(4, 5), 3,
          'get() returns the set value after resize (still in bounds)');
      a.resize(5);
      QUnit.equal(a.get(4, 5), undefined,
          'get() returns the set value (now out of bounds)');

      QUnit.equal(a.set(0, 0, 5), a, 'set at 0,0 is a valid operation');
      QUnit.equal(a.get(0, 0), 5, 'set(0,0,...) actually sets the value');

      QUnit.equal(a.set(0, 0, 0), a, 'set(0,0,0) does not abort');
      QUnit.equal(a.get(0, 0), 0,
          'get(0,0) after setting to 0 does not return undefined');

      QUnit.equal(a.set(1, 2, 3), a, 'set(1,2) does not abort');
      QUnit.equal(a.get(1, 2), 3, 'get(1,2) is valid before remove()');
      QUnit.equal(a.remove(2), a, 'remove returns this');
      QUnit.equal(a.length, 4, 'remove reduces the size of the matrix');
      QUnit.equal(a.get(1, 2), 0,
          'get(1,2) after remove() now points to another element; returns 0');

      a.resize(3);
      a.set(0, 0, -1);
      a.set(0, 1, 0);
      a.set(0, 2, 1);

      QUnit.equal(a.getAbs(0, 0), 1,
          'getAbs: returns the absolute of a negative value');
      QUnit.equal(a.getAbs(0, 1), 0,
          'getAbs: returns the absolute of a zero value');
      QUnit.equal(a.getAbs(0, 2), 1,
          'getAbs: returns the absolute of a positive value');
      QUnit.equal(a.getAbs(0, 3), undefined,
          'getAbs: returns undefined of an out-of-bounds value');
    });
  };
});
