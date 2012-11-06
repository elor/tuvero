/*
 * Vector Tests
 */

test("Vector", function() {
  deepEqual(Vector.Copy([]), [], "copy empty vector");

  var vec = [ 1, 2, 3, 4, 5 ];
  deepEqual(Vector.Copy(vec), vec, "copy populated vector");

  vec = [ 1 ];
  vec[4] = 5;
  deepEqual(Vector.Copy(vec), vec, "copy sparse vector");

  equal(Vector.Dot([], []), 0, "dow with both operands empty");
  equal(Vector.Dot([ 1, 2, 3, 4, 5 ], []), 0, "dot operand a empty");
  equal(Vector.Dot([], [ 1, 2, 3, 4, 5 ]), 0, "dow operand b empty");
  equal(Vector.Dot([ 1, 2, 3 ], [ 3, 2, 1 ]), 10, "dot return value check");

  vec = [];
  vec[5] = 0;
  var ret = Vector.Fill(vec);

  equal(ret, vec, "Fill return value provided");
  equal(vec.length, 6, "Fill vector size retained");
  for ( var i = 0; i < 5; ++i) {
    equal(vec[i], 0, "Fill element " + i + " successfully filled");
  }

  equal(vec[5], 0, "Fill preset element retained");

  deepEqual(Vector.Scale([ 1, 2, 3 ], 1), [ 1, 2, 3 ], "Scale identity");
  deepEqual(Vector.Scale([ 1, 2, 3 ], 0), [ 0, 0, 0 ],
      "Scale by 0 retains size");
  deepEqual(Vector.Scale([ 1, 2, 0 ], -0.3), [ 1 * -0.3, 2 * -0.3, 0 ],
      "Scale negative float factor");

  equal(Vector.Sum([]), 0, "Sum empty vector");
  equal(Vector.Sum([ 1, 2, 3, 4 ]), 10, "Sum populated vector");

  vec = [];
  vec[3] = 5;
  vec[6] = 3;
  equal(Vector.Sum(vec), 8, "Sum sparse vector");
});

/*
 * Matrix Tests
 */

test("FullMatrix", function() {
  // constructor validation
  var a = new FullMatrix();
  equal(a.size, 0, "empty size initialization");
  deepEqual(a.array, [], "empty array initialization");

  a = new FullMatrix(5);
  equal(a.size, 5, "prefixed size initialization");
  deepEqual(a.array, [], "prefixed array initialization");

  // clear
  var b = new FullMatrix(8);
  b.clear(5);
  deepEqual(b, a, "clear validation");

  // extend
  b = (new FullMatrix(4)).extend();
  deepEqual(b, a, "extend() validation");

  b = (new FullMatrix(4)).extend(1);
  deepEqual(b, a, "extend(1) validation");

  b = (new FullMatrix(5)).extend(0);
  deepEqual(b, a, "extend(0) validation");

  b = (new FullMatrix(0)).extend(5);
  deepEqual(b, a, "extend(0) validation");

  // clone, get and set
  a.clear(3);
  a.array[0] = [ 1, 2, 3 ];
  a.array[1] = [];
  a.array[1][2] = 4;

  deepEqual(a.clone(), a, "clone");

  b.clear(3);
  b.set(0, 0, 1).set(0, 1, 2).set(0, 2, 3).set(1, 2, 4);
  deepEqual(b, a, "chained set() commands");

  delete a.array[1][2];
  b.set(1, 2, 0);
  deepEqual(b, a, "set(0) undefines the element");

  equal(b.get(0, 0) === 1 && b.get(0, 1) === 2 && b.get(0, 2) === 3
      && b.get(0, 4) === 0 && b.get(1, 0) === 0 && b.get(1, 2) === 0
      && b.get(2, 3) === 0 && b.get(4, 4) === 0, true, "get test");

  // erase
  a = new FullMatrix(3);
  a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
  b = new FullMatrix(2);
  b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
  deepEqual((new FullMatrix()).erase(0), new FullMatrix(),
      "erase row from matrix of size 0");
  deepEqual((new FullMatrix(3)).erase(0), new FullMatrix(2),
      "erase row from empty matrix");
  deepEqual(a.erase(1), b, "erase row from sparse matrix");
});

test("HalfMatrix",
    function() {
      // constructor validation
      var a = new HalfMatrix();
      equal(a.size, 0, "empty size initialization");
      deepEqual(a.array, [], "empty array initialization");

      a = new HalfMatrix(0, 5);
      equal(a.size, 5, "prefixed size initialization");
      deepEqual(a.array, [], "prefixed array initialization");

      // clear
      var b = new HalfMatrix(0, 8);
      b.clear(5);
      deepEqual(b, a, "clear validation");

      // extend
      b = (new HalfMatrix(0, 4)).extend();
      deepEqual(b, a, "extend() validation");

      b = (new HalfMatrix(0, 4)).extend(1);
      deepEqual(b, a, "extend(1) validation");

      b = (new HalfMatrix(0, 5)).extend(0);
      deepEqual(b, a, "extend(0) validation");

      b = (new HalfMatrix(0, 0)).extend(5);
      deepEqual(b, a, "extend(0) validation");

      // clone, get and set
      a.clear(3);
      a.array = [ [ 1 ], [ undefined, 2 ], [ 3, 4 ] ];

      deepEqual(a.clone(), a, "clone");

      b.clear(3);
      b.set(0, 0, 1).set(0, 2, 5).set(1, 1, 2).set(2, 0, 3).set(2, 1, 4);
      deepEqual(b, a, "chained set() commands (top half ignored)");

      delete a.array[1][2];
      b.set(1, 2, 0);
      deepEqual(b, a, "set(0) undefines the element");

      ok(b.get(0, 0) === 1 && b.get(1, 0) === 0 && b.get(1, 1) === 2
          && b.get(2, 0) === 3 && b.get(2, 1) === 4 && b.get(2, 2) === 0,
          "get test");

      // erase
      a = new HalfMatrix(0, 3);
      a.array = [ [ 1, 2, 3 ], [ 4, 5 ], [ undefined, undefined, 7 ] ];
      b = new HalfMatrix(0, 2);
      b.array = [ [ 1, 3 ], [ undefined, 7 ] ];
      deepEqual((new HalfMatrix()).erase(0), new HalfMatrix(),
          "erase row from matrix of size 0");
      deepEqual((new HalfMatrix(3)).erase(0), new HalfMatrix(2),
          "erase row from empty matrix");
      deepEqual(a.erase(1), b, "erase row from sparse matrix");

      // HalfMatrix.type tests
      // empty
      a = new HalfMatrix(HalfMatrix.empty);
      b = new HalfMatrix(0);
      deepEqual(b, a, "HalfMatrix.empty constant");

      a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
      ok(a.get(2, 2) === 1 && a.get(0, 2) === 0 && a.get(2, 0) === 3,
          "empty get()");

      // mirrored
      a = new HalfMatrix(HalfMatrix.mirrored);
      b = new HalfMatrix(1);
      deepEqual(b, a, "HalfMatrix.mirrored constant");

      a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
      ok(a.get(2, 2) === 1 && a.get(0, 2) === 3 && a.get(2, 0) === 3,
          "mirrored get()");

      // negated
      a = new HalfMatrix(HalfMatrix.negated);
      b = new HalfMatrix(-1);
      deepEqual(b, a, "HalfMatrix.negated constant");

      a.extend(5).set(2, 2, 1).set(0, 2, 2).set(2, 0, 3);
      ok(a.get(2, 2) === 1 && a.get(0, 2) === -3 && a.get(2, 0) === 3,
          "negated get()");
    });

test("Matrix", function() {
  // using FullMatrix implementation due to generality
  var a = new FullMatrix(3);
  a.array = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];
  var out = new FullMatrix(5);

  var transpose = new FullMatrix(3);
  transpose.array = [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ];
  deepEqual(Matrix.Transpose(a.clone()), transpose,
      "Transpose: return value validation");

  out = new FullMatrix(5);

  var b = new FullMatrix(2);
  deepEqual(Matrix.Mult(a, b, out), undefined,
      "Matrix.Mult: abort on different sizes Matrix");
  deepEqual(out, new FullMatrix(),
      "Matrix.Mult: output matrix cleared on abort");

  b.extend();
  b.array = [ undefined, [ 7, 9, 5 ], [ undefined, 3, undefined ] ];
  var expected = new FullMatrix(3);
  expected.array = [ [ 14, 27, 10 ], [ 35, 63, 25 ], [ 56, 99, 40 ] ];
  deepEqual(Matrix.Mult(a, b, out), expected, "Matrix Multiplication");

  var vec = [ 1, 2, 3 ];
  var a = new FullMatrix();
  deepEqual(Matrix.MultVec(b, []), [ 0, 0, 0 ], "MultVec with empty vector");
  deepEqual(Matrix.VecMult([], b), [ 0, 0, 0 ], "VecMult with empty vector");
  deepEqual(Matrix.MultVec(a, vec), [], "MultVec with empty matrix");
  deepEqual(Matrix.VecMult(vec, a), [], "VecMult with empty matrix");
  deepEqual(Matrix.MultVec(b, vec), [ 0, 40, 6 ], "MultVec check");
  deepEqual(Matrix.VecMult(vec, b), [ 14, 27, 10 ], "VecMult check");

  // GetRow und GetCol
  deepEqual(Matrix.GetRow(b, 1), [ 7, 9, 5 ], "GetRow with populated row");
  deepEqual(Matrix.GetRow(b, 2), [ 0, 3, 0 ], "GetRow with sparse row");
  deepEqual(Matrix.GetRow(b, 0), [ 0, 0, 0 ], "GetRow with empty row");

  out = Matrix.Transpose(b.clone());
  deepEqual(Matrix.GetCol(out, 1), [ 7, 9, 5 ], "GetCol with populated col");
  deepEqual(Matrix.GetCol(out, 2), [ 0, 3, 0 ], "GetCol with sparse col");
  deepEqual(Matrix.GetCol(out, 0), [ 0, 0, 0 ], "GetCol with empty col");

  // Sums
  deepEqual(Matrix.RowSum(b, 1), 21, "RowSum populated row");
  deepEqual(Matrix.RowSum(b, 2), 3, "RowSum sparse row");
  deepEqual(Matrix.RowSum(b, 0), 0, "RowSum empty row");

  deepEqual(Matrix.ColSum(out, 1), 21, "ColSum populated row");
  deepEqual(Matrix.ColSum(out, 2), 3, "ColSum sparse row");
  deepEqual(Matrix.ColSum(out, 0), 0, "ColSum empty row");

  deepEqual(Matrix.RowSums(a), [], "RowSums with matrix of size 0");
  deepEqual(Matrix.RowSums(b), [ 0, 21, 3 ], "RowSums with sparse matrix");
  deepEqual(Matrix.ColSums(a), [], "ColSums with matrix of size 0");
  deepEqual(Matrix.ColSums(out), [ 0, 21, 3 ], "ColSums with sparse matrix");
});
