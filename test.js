var print = function(matrix) {
  var size = matrix.size;
  var arr = ["Matrix [\n"];
  for ( var i = 0; i < size; ++i) {
    arr.push([ "  [" ]);
    for ( var j = 0; j < size; ++j) {
      arr.push(matrix.get(i, j));
      arr.push(", ");
    }
    arr.pop();
    arr.push("],\n");
  }
  arr.push("];");
  console.log(arr.join(''));
};

var A = new FullMatrix(3);
A.set(0, 1, 1);
A.set(1, 0, 2);
A.set(1, 1, 3);
A.set(1, 2, 4);
A.set(2, 1, 5);

var B = new HalfMatrix(-1);
B.clear(3);
B.set(0, 0, 1);
B.set(1, 2, 1);

var C = new FullMatrix();

console.log(Matrix.Mult(A, B, C));
print(C);
