/*
 * Various Matrix Tests
 */
define([ 'lib/qunit', '../fullmatrix', '../halfmatrix', '../matrix', '../vector',
    '../../lib/implements' ], function (QUnit, FullMatrix, HalfMatrix, Matrix, Vector, Interface) {
  /*
   * FullMatrix Tests
   */
  QUnit.test("FullMatrix", function () {
    // constructor validation
    var a, b;
    
    QUnit.equal(Interface(Matrix), '', 'Matrix interface validation');
    QUnit.equal(Interface(Matrix, FullMatrix), '', 'FullMatrix interface match');

    a = new FullMatrix();
    QUnit.equal(a.size, 0, "empty size initialization");
    QUnit.deepEqual(a.array, [], "empty array initialization");

    a = new FullMatrix(5);
    QUnit.equal(a.size, 5, "prefixed size initialization");
    QUnit.deepEqual(a.array, [], "prefixed array initialization");

    // clear
    b = new FullMatrix(8);
    b.clear(5);
    QUnit.deepEqual(b, a, "clear validation");

    // extend
    b = (new FullMatrix(4)).extend();
    QUnit.deepEqual(b, a, "extend() validation");

    b = (new FullMatrix(4)).extend(1);
    QUnit.deepEqual(b, a, "extend(1) validation");

    b = (new FullMatrix(5)).extend(0);
    QUnit.deepEqual(b, a, "extend(0) validation");

    b = (new FullMatrix(0)).extend(5);
    QUnit.deepEqual(b, a, "extend(0) validation");

    // clone, get and set
    a.clear(3);
    a.array[0] = [ 1, 2, 3 ];
    a.array[1] = [];
    a.array[1][2] = 4;

    QUnit.deepEqual(a.clone(), a, "clone");

    b.clear(3);
    b.set(0, 0, 1).set(0, 1, 2).set(0, 2, 3).set(1, 2, 4);
    QUnit.deepEqual(b, a, "chained set() commands");

    delete a.array[1][2];
    b.set(1, 2, 0);
    QUnit.deepEqual(b, a, "set(0) undefines the element");

    QUnit.equal(b.get(0, 0) === 1 && b.get(0, 1) === 2 && b.get(0, 2) === 3 && b.get(0, 4) === 0 && b.get(1, 0) === 0 && b.get(1, 2) === 0 && b.get(2, 3) === 0 && b.get(4, 4) === 0, true, "get QUnit.test");

    // erase
    a = new FullMatrix(3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
    b = new FullMatrix(2);
    b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
    QUnit.deepEqual((new FullMatrix()).erase(0), new FullMatrix(), "erase row from matrix of size 0");
    QUnit.deepEqual((new FullMatrix(3)).erase(0), new FullMatrix(2), "erase row from empty matrix");
    QUnit.deepEqual(a.erase(1), b, "erase row from sparse matrix");
  });

  /*
   * HalfMatrix Tests
   */
  QUnit.test("HalfMatrix", function () {
    var a, b;

    // constructor validation
    a = new HalfMatrix();
    QUnit.equal(a.size, 0, "empty size initialization");
    QUnit.deepEqual(a.array, [], "empty array initialization");

    a = new HalfMatrix(0, 5);
    QUnit.equal(a.size, 5, "prefixed size initialization");
    QUnit.deepEqual(a.array, [], "prefixed array initialization");

    // clear
    b = new HalfMatrix(0, 8);
    b.clear(5);
    QUnit.deepEqual(b, a, "clear validation");

    // extend
    b = (new HalfMatrix(0, 4)).extend();
    QUnit.deepEqual(b, a, "extend() validation");

    b = (new HalfMatrix(0, 4)).extend(1);
    QUnit.deepEqual(b, a, "extend(1) validation");

    b = (new HalfMatrix(0, 5)).extend(0);
    QUnit.deepEqual(b, a, "extend(0) validation");

    b = (new HalfMatrix(0, 0)).extend(5);
    QUnit.deepEqual(b, a, "extend(0) validation");

    // clone, get and set
    a.clear(3);
    a.array = [ [ 1 ], [ undefined, 2 ], [ 3, 4 ] ];

    QUnit.deepEqual(a.clone(), a, "clone");

    b.clear(3);
    b.set(0, 0, 1).set(0, 2, 5).set(1, 1, 2).set(2, 0, 3).set(2, 1, 4);
    QUnit.deepEqual(b, a, "chained set() commands (top half ignored)");

    delete a.array[1][2];
    b.set(1, 2, 0);
    QUnit.deepEqual(b, a, "set(0) undefines the element");

    QUnit.ok(b.get(0, 0) === 1 && b.get(1, 0) === 0 && b.get(1, 1) === 2 && b.get(2, 0) === 3 && b.get(2, 1) === 4 && b.get(2, 2) === 0, "get QUnit.test");

    // erase
    a = new HalfMatrix(0, 3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
    b = new HalfMatrix(0, 2);
    b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
    QUnit.deepEqual((new HalfMatrix()).erase(0), new HalfMatrix(), "erase row from matrix of size 0");
    QUnit.deepEqual((new HalfMatrix(3)).erase(0), new HalfMatrix(2), "erase row from empty matrix");
    QUnit.deepEqual(a.erase(1), b, "erase row from sparse matrix");

    // HalfMatrix.type QUnit.tests
    // empty
    a = new HalfMatrix(HalfMatrix.empty);
    b = new HalfMatrix(0);
    QUnit.deepEqual(b, a, "HalfMatrix.empty constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === 0 && a.get(2, 0) === 3, "empty get()");

    // mirrored
    a = new HalfMatrix(HalfMatrix.mirrored);
    b = new HalfMatrix(1);
    QUnit.deepEqual(b, a, "HalfMatrix.mirrored constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === 3 && a.get(2, 0) === 3, "mirrored get()");

    // negated
    a = new HalfMatrix(HalfMatrix.negated);
    b = new HalfMatrix(-1);
    QUnit.deepEqual(b, a, "HalfMatrix.negated constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === -3 && a.get(2, 0) === 3, "negated get()");
  });

  /*
   * Matrix Tests
   */
  QUnit.test("Matrix", function () {
    var a, b, vec, out, transpose, expected;

    // using FullMatrix implementation due to
    // generality
    a = new FullMatrix(3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
    out = new FullMatrix(5);

    transpose = new FullMatrix(3);
    transpose.array = [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ];
    QUnit.deepEqual(Matrix.transpose(a.clone()), transpose, "transpose: return value validation");

    out = new FullMatrix(5);

    b = new FullMatrix(2);
    QUnit.deepEqual(Matrix.mult(a, b, out), undefined, "Matrix.mult: abort on different sizes Matrix");
    QUnit.deepEqual(out, new FullMatrix(), "Matrix.mult: output matrix cleared on abort");

    b.extend();
    b.array = [ undefined, [ 7, 9, 5 ], [ undefined, 3, undefined ] ];
    expected = new FullMatrix(3);
    expected.array = [ [ 14, 27, 10 ], [ 35, 63, 25 ], [ 56, 99, 40 ] ];
    QUnit.deepEqual(Matrix.mult(a, b, out), expected, "Matrix multiplication");

    vec = [ 1, 2, 3 ];
    a = new FullMatrix();
    QUnit.deepEqual(Matrix.multVec(b, []), [ 0, 0, 0 ], "multVec with empty vector");
    QUnit.deepEqual(Matrix.vecMult([], b), [ 0, 0, 0 ], "vecMult with empty vector");
    QUnit.deepEqual(Matrix.multVec(a, vec), [], "multVec with empty matrix");
    QUnit.deepEqual(Matrix.vecMult(vec, a), [], "vecMult with empty matrix");
    QUnit.deepEqual(Matrix.multVec(b, vec), [ 0, 40, 6 ], "multVec check");
    QUnit.deepEqual(Matrix.vecMult(vec, b), [ 14, 27, 10 ], "vecMult check");

    // getRow und getCol
    QUnit.deepEqual(Matrix.getRow(b, 1), [ 7, 9, 5 ], "getRow with populated row");

    vec = Matrix.getRow(b, 2);
    QUnit.deepEqual(vec, [ 0, 3, 0 ], "getRow with sparse row");

    QUnit.deepEqual(Matrix.getRow(b, 0), [ 0, 0, 0 ], "getRow with empty row");

    out = Matrix.transpose(b.clone());
    QUnit.deepEqual(Matrix.getCol(out, 1), [ 7, 9, 5 ], "getCol with populated col");
    QUnit.deepEqual(Matrix.getCol(out, 2), [ 0, 3, 0 ], "getCol with sparse col");
    vec = Matrix.getCol(out, 0);
    QUnit.deepEqual(vec, [ 0, 0, 0 ], "getCol with empty col");

    // sums
    QUnit.deepEqual(Matrix.rowSum(b, 1), 21, "rowSum populated row");
    QUnit.deepEqual(Matrix.rowSum(b, 2), 3, "rowSum sparse row");
    QUnit.deepEqual(Matrix.rowSum(b, 0), 0, "rowSum empty row");

    QUnit.deepEqual(Matrix.colSum(out, 1), 21, "colSum populated row");
    QUnit.deepEqual(Matrix.colSum(out, 2), 3, "colSum sparse row");
    QUnit.deepEqual(Matrix.colSum(out, 0), 0, "colSum empty row");

    QUnit.deepEqual(Matrix.rowSums(a), [], "rowSums with matrix of size 0");
    QUnit.deepEqual(Matrix.rowSums(b), [ 0, 21, 3 ], "rowSums with sparse matrix");
    QUnit.deepEqual(Matrix.colSums(a), [], "colSums with matrix of size 0");
    QUnit.deepEqual(Matrix.colSums(out), [ 0, 21, 3 ], "colSums with sparse matrix");
  });
});
