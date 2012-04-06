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
    } else {
      ret[i] = 0;
    }
  }

  return ret;
}

Ranking.prototype.process = function() {
  var length = this.wins.length;
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

  var abssort = function(a, b) {
    return (absolute.wins[b] - absolute.wins[a]) || (absolute.buchholz[b] - absolute.buchholz[a]) || (absolute.feinbuchholz[b] - absolute.feinbuchholz[a]) || (absolute.netto[b] - absolute.netto[a]) || (b - a);
  }
  var relsort = function(a, b) {
    return (relative.wins[b] - relative.wins[a]) || (relative.buchholz[b] - relative.buchholz[a]) || (relative.feinbuchholz[b] - relative.feinbuchholz[a]) || (relative.netto[b] - relative.netto[a]) || (b - a);
  }

  var abs = absolute.ranking = [];
  var rel = relative.ranking = [];
  var i;
  for (i = 0; i < length; ++i) {
    abs[i] = rel[i] = i;
  }

  abs.sort(abssort);
  rel.sort(relsort);

  return {
    absolute: absolute,
    relative: relative
  };
};

// test

var rk = new Ranking();
rk.games.fromString("0 2 1\n2 0 1\n1 1 0\n");
rk.wins = [1, 2, 1];
rk.netto = [1, 2, 3];

