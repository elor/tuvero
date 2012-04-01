function Square(size) {
  size = size || 0;
  this.matrix = [];

  while (size--) {
    this.matrix.push([]);
  }
}

Square.prototype.toString = function() {
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

Square.prototype.toTriString = function() {
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
    
    for (j = 0; j < i; ++j) {
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
}

Square.prototype.fromString = function(string) {
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
      if (numbers[j]) {
        ptr[j] = Number(numbers[j]);
      }
    }

    this.matrix.push(ptr);
  }

  return this;
};

Square.prototype.fromTriString = function(string) {
  var lines = string.split('\n');
  var numbers;
  var size = lines.length - 1;
  var i, j;
  var val;

  this.matrix = [];

  for (i = 0; i < size; ++i) {
    this.matrix[i] = [];
  }

  for (i = 0; i < size; ++i) {
    numbers = lines[i].split(' ');
    for (j = 0; j < i; ++j) {
      if (numbers[j]) {
        val = Number(numbers[j])
        this.matrix[i][j] = val;
        this.matrix[j][i] = val;
      }
    }
  }

  return this;
};

Square.prototype.extend = function(by) {
  by = by || 1;

  while (by--) {
    this.matrix.push([]);
  }

  return this;
};

Square.prototype.vecmult = function(vec) {
  var ret = [];
  var i, j;
  var size = this.matrix.length;
  var val;

  if (size != vec.length) {
    return;
  }

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += vec[j] * (this.matrix[j][i] || 0);
    }

    ret[i] = val;
  }

  return ret;
};

Square.prototype.multvec = function(vec) {
  var ret = [];
  var i, j;
  var size = this.matrix.length;
  var val;

  if (size != vec.length) {
    return undefined;
  }

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += (this.matrix[i][j] || 0) * vec[j];
    }

    ret[i] = val;
  }

  return ret;
};

Square.prototype.mult = function(sq2) {
  var i, j, k;
  var size = this.matrix.length;
  var val;
  var ret;

  if (size != sq2.matrix.length) {
    return;
  }

  ret = new Square(size);

  for (i = 0; i < size; ++i) {
    for (j = 0; j < size; ++j) {
      val = 0;
      for (k = 0; k < size; ++k) {
        val += (this.matrix[j][k] || 0) * (sq2.matrix[k][i] || 0);
      }

      if (val) {
        ret.matrix[j][i] = val;
      }
    }
  }

  return ret;
};

Square.prototype.sumWithTranspose = function() {
  var size = this.matrix.length;
  var ret = new Square(size);
  var i, j;
  var mat = this.matrix;
  var tam = ret.matrix;
  var val;
    
  for (i = 0; i < size; ++i) {
    for (j = 0; j < i; ++j) {
      val = (mat[i][j] || 0) + (mat[j][i] || 0);
      if (val) {
        tam[i][j] = val;
        tam[j][i] = val;
      }
    }
  }

  return ret;
};

Square.prototype.clone = function() {
  var size = this.matrix.length;
  var ret = new Square(size);
  var i, j;
  var mat = this.matrix;
  var tam = ret.matrix;
    
  for (i = 0; i < size; ++i) {
    for (j = 0; j < size; ++j) {
      if (mat[i][j]) {
        tam[i][j] = mat[i][j];
      }
    }
  }

  return ret;
};

Square.sum = function(sq, sq2) {
  var size = sq.matrix.length;
  var ret;
  var i, j;
  var mat, m1, m2;
  var val;

  if (size != sq2.matrix.length) {
    return;
  }
  
  ret = new Square(size);
  mat = ret.matrix;
  m1 = sq.matrix;
  m2 = sq2.matrix;

  for (i = 0; i < size; ++i) {
    for (j = 0; j < size; ++j) {
      val = (m1[i][j] || 0) + (m2[i][j] || 0);
      if (val) {
        mat[i][j] = val;
      }
    }
  }
};

Square.diff = function(sq, sq2) {
  var size = sq.matrix.length;
  var ret;
  var i, j;
  var mat, m1, m2;

  if (size != sq2.matrix.length) {
    return;
  }
  
  ret = new Square(size);
  mat = ret.matrix;
  m1 = sq.matrix;
  m2 = sq2.matrix;

  for (i = 0; i < size; ++i) {
    for (j = 0; j < size; ++j) {
      val = (m1[i][j] || 0) - (m2[i][j] || 0);
      if (val) {
        mat[i][j] = val;
      }
    }
  }
};

Square.linesum = function() {
  var ret = [];
  var size = this.matrix.length;
  var i, j;
  var val;
  var mat = this.matrix;

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += (mat[i][j] || 0);
    }

    ret[i] = val;
  }

};

Square.rowsum = function() {
  var ret = [];
  var size = this.matrix.length;
  var i, j;
  var val;
  var mat = this.matrix;

  for (i = 0; i < size; ++i) {
    val = 0;
    for (j = 0; j < size; ++j) {
      val += (mat[j][i] || 0);
    }

    ret[i] = val;
  }

};

