function Player(pid, name) {
  this.name = name.replace('\\', '') || "noname";
  this.id = Number(pid);

  this.female = false;
  this.inactive = false;

  this.S = false;  // Schiesser?
  this.L = false;  // Leger?
  this.B = false;  // A or B?
}
Player.list = [];

Player.prototype.toString = function() {
  return (this.female ? 'F' : '') + (this.S ? 'S' : '') + (this.L ? 'L' : '')
      + (this.B ? 'B' : '') + (this.inactive ? 'I' : '') + '\\' + this.name;
};

// Player.parse
//
// This function turns a string or Players (database or file segment) into the
// current list of players, thereby destroying the current list
Player.parse = function (string) {
  Player.list = [];

  if (!string) {
    return;
  }

  var lines = string.split('\n');
  var tmp;
  var o;  // options
  var p;  // instance of new player created from one line
  for (var pid in lines) {
    tmp = lines[pid].split('\\');
    o = tmp.shift().toUpperCase();
    p = new Player(pid, tmp[0]);

    for (var i in o) {
      switch (o[i]) {
        case 'F':
          p.female = true;
          break;
        case 'S':
          p.S = true;
          break;
        case 'L':
          p.L = true;
          break;
        case 'B':
          p.B = true;
          break;
        case 'I':
          p.inactive = true;
          break;
      }
    }

    Player.list[pid] = p;
  }
};

Player.load = function () {
  Player.parse(localStorage.getItem('boules.players'));
};

Player.compose = function() {
  var lines = [];
  var p = Player.list;
  var length = p.length;

  if (length === 0) {
    return '';
  }
  
  for (var i=0; i < length; ++i) {
    lines.push(p[i].toString());
  }
  
  return lines.join('\n');
};

Player.save = function () {
  localStorage.setItem('boules.players', Player.compose());
};

