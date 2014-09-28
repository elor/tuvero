/*
 * Vector Tests
 */
define(function () {
  return function (QUnit, require) {
    var Vector = require('backend/vector');
    QUnit.test("Vector", function () {
      var vec, ret, i;

      QUnit.deepEqual(Vector.copy([]), [], "copy empty vector");

      vec = [ 1, 2, 3, 4, 5 ];
      QUnit.deepEqual(Vector.copy(vec), vec, "copy populated vector");

      vec = [ 1 ];
      vec[4] = 5;
      QUnit.deepEqual(Vector.copy(vec), vec, "copy sparse vector");

      QUnit.equal(Vector.dot([], []), 0, "dow with both operands empty");
      QUnit.equal(Vector.dot([ 1, 2, 3, 4, 5 ], []), 0, "dot operand a empty");
      QUnit.equal(Vector.dot([], [ 1, 2, 3, 4, 5 ]), 0, "dow operand b empty");
      QUnit.equal(Vector.dot([ 1, 2, 3 ], [ 3, 2, 1 ]), 10, "dot return value check");

      vec = [];
      vec[5] = 0;
      ret = Vector.fill(vec);

      QUnit.equal(ret, vec, "fill return value provided");
      QUnit.equal(vec.length, 6, "fill vector size retained");
      for (i = 0; i < 5; i += 1) {
        QUnit.equal(vec[i], 0, "fill element " + i + " successfully filled");
      }

      QUnit.equal(vec[5], 0, "fill preset element retained");

      vec = [ 1, 2, 3 ];
      ret = Vector.scale(vec, 1);
      QUnit.deepEqual(ret, vec, "scale identity");
      QUnit.deepEqual(Vector.scale([ 1, 2, 3 ], 0), [ 0, 0, 0 ], "scale by 0 retains size");
      QUnit.deepEqual(Vector.scale([ 1, 2, 0 ], -0.3), [ -0.3, 2 * -0.3, 0 ], "scale negative float factor");

      QUnit.equal(Vector.sum([]), 0, "sum empty vector");
      QUnit.equal(Vector.sum([ 1, 2, 3, 4 ]), 10, "sum populated vector");

      vec = [];
      vec[3] = 5;
      vec[6] = 3;
      QUnit.equal(Vector.sum(vec), 8, "sum sparse vector");
    });
  };
});
