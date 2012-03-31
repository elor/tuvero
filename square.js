function Square () {
  this.matrix = [];
}

Square.prototype.toString = function () {
  var lines = [];
  var i;
  var j;
  var line;
  var ptr;
  var allnull;
  var size = this.matrix.length;

  if (!size) {
    return '';
  }

  for (i = 0; i < size; ++i) {
    line = [];
    ptr = this.matrix[i];

    allnull = true;
    
    for (j = 0; j < ptr.length; ++j) {
      if (ptr[j]) {
        line.push(ptr[j]);
        allnull = false;
      } else {
        line.push('');
      }
    }

    for (j = line.length - 1; j >= 0; --j) {
      if (line[j]) {
        line.length = j + 1;
        break;
      }
    }
    
    lines.push(line.join(' '));
  }

  return lines.join('\n') + '\n';
};

Square.prototype.fromString = function (string) {
  var lines = string.split('\n');
  var numbers;
  var size = lines.length - 1;
  var i;
  var j;
  var ptr;

  this.matrix = [];

  for (i = 0; i < size; ++i) {
    ptr = [];

    numbers = lines[i].split(' ');
    for (j = 0; j < size; ++j) {
      ptr.push(Number(numbers[j] || 0));
    }

    this.matrix.push(ptr);
  }

  return this;
};

Square.prototype.extend = function () {
  var size = this.matrix.length;
  var i;
  this.matrix.push([]);

  for (i = 0; i < size; ++i) {
    this.matrix[i].push(0);
    this.matrix[size].push(0);
  }

  return this;
};

Square.prototype.vecmult = function (vec) {
  var ret = [];
  var i;
  var j;
  var size = this.matrix.length;
  var val;

  if (size != vec.length) {
    return undefined;
  }

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += vec[i] * this.matrix[j][i];
    }

    ret.push(val);
  }

  return ret;
};

Square.prototype.multvec = function (vec) {
  var ret = [];
  var i;
  var j;
  var size = this.matrix.length;
  var val;

  if (size != vec.length) {
    return undefined;
  }

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += this.matrix[i][j] * vec[i];
    }

    ret.push(val);
  }

  return ret;
}

Square.prototype.mult = function (sq2) {
  var ret = new Square;
  var i, j, k;
  var size = this.matrix.length;
  var val;

  if (size != sq2.matrix.length) {
    return;
  }

  for (i = 0; i < size; ++i) {
    ret.matrix[i] = [];
  }

  for (i = 0; i < size; ++i) {
    for (j = 0; j < size; ++j) {
      val = 0;
      for (k = 0; k < size; ++k) {
        val += this.matrix[j][k] * sq2.matrix[k][i];
      }
      ret.matrix[j][i] = val;
    }
  }

  return ret;
};

// test begin
var I = new Square();
I.fromString("1\n 1\n  1\n");

V = [1, 2, 3];

var M1 = new Square();
M1.fromString("1\n\n\n");

var M2 = new Square();
M2.fromString("\n 1\n\n");

var M3 = new Square();
M3.fromString("\n\n  1\n");

var D1 = new Square();
D1.fromString("\n\n1\n");

// test end
