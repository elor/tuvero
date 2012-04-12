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

Ranking.prototype.addResult = function(team_a, team_b, score_a, score_b) {
  var diff = score_b - score_a;
  var a_wins = diff < 0;

  var size_a, size_b;
  var i, j;
  var a, b;

  if (typeof team_a == "number") {
    team_a = [team_a];
  }
  if (typeof team_b == "number") {
    team_b = [team_b];
  }

  size_a = team_a.length;
  size_b = team_b.length;
  for (i = 0; i < size_a; ++i) {
    a = team_a[i];
    if (a_wins) {
      ++this.wins[a];
    }

    this.netto[a] -= diff;

    for (j = 0; j < size_b; ++j) {
      b = team_b[j];

      this.games.matrix[a][b] = (this.games.matrix[a][b] || 0) + 1;
      this.games.matrix[b][a] = this.games.matrix[a][b];
    }
  }

  console.log('asd');
  for (i = 0; i < size_b; ++i) {
    b = team_b[i];
    if (!a_wins) {
      ++this.wins[b];
    }

    this.netto[b] += diff;
  }
};

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
rk.games.fromTriString("\n\n\n");
rk.wins = [0, 0, 0];
rk.netto = [0, 0, 0];

