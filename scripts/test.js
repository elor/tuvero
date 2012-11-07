/*
 * Vector Tests
 */

require([ "vector" ], function (Vector) {
  QUnit.test("Vector", function () {
    var vec, ret, i;

    QUnit.deepEqual(Vector.Copy([]), [], "copy empty vector");

    vec = [ 1, 2, 3, 4, 5 ];
    QUnit.deepEqual(Vector.Copy(vec), vec, "copy populated vector");

    vec = [ 1 ];
    vec[4] = 5;
    QUnit.deepEqual(Vector.Copy(vec), vec, "copy sparse vector");

    QUnit.equal(Vector.Dot([], []), 0, "dow with both operands empty");
    QUnit.equal(Vector.Dot([ 1, 2, 3, 4, 5 ], []), 0, "dot operand a empty");
    QUnit.equal(Vector.Dot([], [ 1, 2, 3, 4, 5 ]), 0, "dow operand b empty");
    QUnit.equal(Vector.Dot([ 1, 2, 3 ], [ 3, 2, 1 ]), 10,
        "dot return value check");

    vec = [];
    vec[5] = 0;
    ret = Vector.Fill(vec);

    QUnit.equal(ret, vec, "Fill return value provided");
    QUnit.equal(vec.length, 6, "Fill vector size retained");
    for (i = 0; i < 5; i += 1) {
      QUnit.equal(vec[i], 0, "Fill element " + i + " successfully filled");
    }

    QUnit.equal(vec[5], 0, "Fill preset element retained");

    vec = [ 1, 2, 3 ];
    ret = Vector.Scale(vec, 1);
    QUnit.deepEqual(ret, vec, "Scale identity");
    QUnit.deepEqual(Vector.Scale([ 1, 2, 3 ], 0), [ 0, 0, 0 ],
        "Scale by 0 retains size");
    QUnit.deepEqual(Vector.Scale([ 1, 2, 0 ], -0.3), [ -0.3, 2 * -0.3, 0 ],
        "Scale negative float factor");

    QUnit.equal(Vector.Sum([]), 0, "Sum empty vector");
    QUnit.equal(Vector.Sum([ 1, 2, 3, 4 ]), 10, "Sum populated vector");

    vec = [];
    vec[3] = 5;
    vec[6] = 3;
    QUnit.equal(Vector.Sum(vec), 8, "Sum sparse vector");
  });
});

/*
 * Matrix Tests
 */

require([ "fullmatrix" ], function (FullMatrix) {
  QUnit.test("FullMatrix", function () {
    // constructor validation
    var a, b;

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

    QUnit.equal(b.get(0, 0) === 1 && b.get(0, 1) === 2 && b.get(0, 2) === 3
        && b.get(0, 4) === 0 && b.get(1, 0) === 0 && b.get(1, 2) === 0
        && b.get(2, 3) === 0 && b.get(4, 4) === 0, true, "get QUnit.test");

    // erase
    a = new FullMatrix(3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
    b = new FullMatrix(2);
    b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
    QUnit.deepEqual((new FullMatrix()).erase(0), new FullMatrix(),
        "erase row from matrix of size 0");
    QUnit.deepEqual((new FullMatrix(3)).erase(0), new FullMatrix(2),
        "erase row from empty matrix");
    QUnit.deepEqual(a.erase(1), b, "erase row from sparse matrix");
  });
});

require([ "halfmatrix" ], function (HalfMatrix) {
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

    QUnit.ok(b.get(0, 0) === 1 && b.get(1, 0) === 0 && b.get(1, 1) === 2
        && b.get(2, 0) === 3 && b.get(2, 1) === 4 && b.get(2, 2) === 0,
        "get QUnit.test");

    // erase
    a = new HalfMatrix(0, 3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
    b = new HalfMatrix(0, 2);
    b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
    QUnit.deepEqual((new HalfMatrix()).erase(0), new HalfMatrix(),
        "erase row from matrix of size 0");
    QUnit.deepEqual((new HalfMatrix(3)).erase(0), new HalfMatrix(2),
        "erase row from empty matrix");
    QUnit.deepEqual(a.erase(1), b, "erase row from sparse matrix");

    // HalfMatrix.type QUnit.tests
    // empty
    a = new HalfMatrix(HalfMatrix.empty);
    b = new HalfMatrix(0);
    QUnit.deepEqual(b, a, "HalfMatrix.empty constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === 0 && a.get(2, 0) === 3,
        "empty get()");

    // mirrored
    a = new HalfMatrix(HalfMatrix.mirrored);
    b = new HalfMatrix(1);
    QUnit.deepEqual(b, a, "HalfMatrix.mirrored constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === 3 && a.get(2, 0) === 3,
        "mirrored get()");

    // negated
    a = new HalfMatrix(HalfMatrix.negated);
    b = new HalfMatrix(-1);
    QUnit.deepEqual(b, a, "HalfMatrix.negated constant");

    a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
    QUnit.ok(a.get(2, 2) === 1 && a.get(0, 2) === -3 && a.get(2, 0) === 3,
        "negated get()");
  });
});

require([ "matrix", "fullmatrix", "vector" ], function (Matrix, FullMatrix,
    Vector) {
  QUnit.test("Matrix", function () {
    var a, b, vec, out, transpose, expected;

    // using FullMatrix implementation due to
    // generality
    a = new FullMatrix(3);
    a.array = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
    out = new FullMatrix(5);

    transpose = new FullMatrix(3);
    transpose.array = [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ];
    QUnit.deepEqual(Matrix.Transpose(a.clone()), transpose,
        "Transpose: return value validation");

    out = new FullMatrix(5);

    b = new FullMatrix(2);
    QUnit.deepEqual(Matrix.Mult(a, b, out), undefined,
        "Matrix.Mult: abort on different sizes Matrix");
    QUnit.deepEqual(out, new FullMatrix(),
        "Matrix.Mult: output matrix cleared on abort");

    b.extend();
    b.array = [ undefined, [ 7, 9, 5 ], [ undefined, 3, undefined ] ];
    expected = new FullMatrix(3);
    expected.array = [ [ 14, 27, 10 ], [ 35, 63, 25 ], [ 56, 99, 40 ] ];
    QUnit.deepEqual(Matrix.Mult(a, b, out), expected, "Matrix Multiplication");

    vec = [ 1, 2, 3 ];
    a = new FullMatrix();
    QUnit.deepEqual(Matrix.MultVec(b, []), [ 0, 0, 0 ],
        "MultVec with empty vector");
    QUnit.deepEqual(Matrix.VecMult([], b), [ 0, 0, 0 ],
        "VecMult with empty vector");
    QUnit.deepEqual(Matrix.MultVec(a, vec), [], "MultVec with empty matrix");
    QUnit.deepEqual(Matrix.VecMult(vec, a), [], "VecMult with empty matrix");
    QUnit.deepEqual(Matrix.MultVec(b, vec), [ 0, 40, 6 ], "MultVec check");
    QUnit.deepEqual(Matrix.VecMult(vec, b), [ 14, 27, 10 ], "VecMult check");

    // GetRow und GetCol
    QUnit.deepEqual(Matrix.GetRow(b, 1), [ 7, 9, 5 ],
        "GetRow with populated row");

    vec = Matrix.GetRow(b, 2);
    QUnit.deepEqual(vec, [ 0, 3, 0 ], "GetRow with sparse row");

    QUnit.deepEqual(Matrix.GetRow(b, 0), [ 0, 0, 0 ], "GetRow with empty row");

    out = Matrix.Transpose(b.clone());
    QUnit.deepEqual(Matrix.GetCol(out, 1), [ 7, 9, 5 ],
        "GetCol with populated col");
    QUnit.deepEqual(Matrix.GetCol(out, 2), [ 0, 3, 0 ],
        "GetCol with sparse col");
    vec = Matrix.GetCol(out, 0);
    QUnit.deepEqual(vec, [ 0, 0, 0 ], "GetCol with empty col");

    // Sums
    QUnit.deepEqual(Matrix.RowSum(b, 1), 21, "RowSum populated row");
    QUnit.deepEqual(Matrix.RowSum(b, 2), 3, "RowSum sparse row");
    QUnit.deepEqual(Matrix.RowSum(b, 0), 0, "RowSum empty row");

    QUnit.deepEqual(Matrix.ColSum(out, 1), 21, "ColSum populated row");
    QUnit.deepEqual(Matrix.ColSum(out, 2), 3, "ColSum sparse row");
    QUnit.deepEqual(Matrix.ColSum(out, 0), 0, "ColSum empty row");

    QUnit.deepEqual(Matrix.RowSums(a), [], "RowSums with matrix of size 0");
    QUnit.deepEqual(Matrix.RowSums(b), [ 0, 21, 3 ],
        "RowSums with sparse matrix");
    QUnit.deepEqual(Matrix.ColSums(a), [], "ColSums with matrix of size 0");
    QUnit.deepEqual(Matrix.ColSums(out), [ 0, 21, 3 ],
        "ColSums with sparse matrix");
  });
});
