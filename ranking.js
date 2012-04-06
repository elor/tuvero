function Ranking() {
  this.games = new Square();
  this.wins = [];
  this.netto = [];
}

Ranking.ArrayDivision = function(a, b) {
  var length = b.length;
  var ret = [];
  var i;

  if (a.length > b.length) {
    length = a.length;
  }

  for (i = 0; i < length; ++i) {
    if (b[i] && a[i] !== undefined) {
      ret[i] = a[i] / b[i];
    }
  }

  return ret;
}

Ranking.prototype.process = function() {
  var buchholz = this.games.multvec(this.wins);
  var absolute = {
    games: this.games.linesum(),
    wins: this.wins,
    buchholz: buchholz,
    feinbuchholz: this.games.multvec(buchholz),
    netto: this.netto
  };

  var relative = {
    games: absolute.games,
    wins: Ranking.ArrayDivision(absolute.wins, absolute.games),
    buchholz: Ranking.ArrayDivision(absolute.buchholz, absolute.games),
    feinbuchholz: Ranking.ArrayDivision(absolute.feinbuchholz, absolute.games),
    netto: Ranking.ArrayDivision(absolute.netto, absolute.games)
  };

  return {
    absolute: absolute,
    relative: relative
  };
};

// test

var rk = new Ranking();
rk.games.fromString("0 2 1\n2 0 1\n1 1 0\n");
rk.wins = [2, 1, 1];
this.netto = [1, 2, 3];

