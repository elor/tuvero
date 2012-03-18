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

    if (allnull) {
      lines.push('');
    } else {
      lines.push(line.join(' '));
    }
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

    if (lines[i]) {
      numbers = lines[i].split(' ');
      for (j = 0; j < size; ++j) {
        ptr.push(Number(numbers[j]));
      }
    } else {
      for (j = 0; j < size; ++j) {
        ptr.push(0);
      }
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
}

Square.prototype.multvec = function () {
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

