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
    if (b[i] && a[i]) {
      ret[i] = a[i] / b[i];
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
      this.wins[a] = (this.wins[a] || 0) + 1;
    }

    this.netto[a] = (this.netto[a] || 0) - diff;

    for (j = 0; j < size_b; ++j) {
      b = team_b[j];

      this.games.matrix[a][b] = (this.games.matrix[a][b] || 0) + 1;
      this.games.matrix[b][a] = this.games.matrix[a][b];
    }
  }

  for (i = 0; i < size_b; ++i) {
    b = team_b[i];
    if (!a_wins) {
      this.wins[b] = (this.wins[b] || 0) + 1;
    }

    this.netto[b] = (this.netto[b] || 0) + diff;
  }
};

Ranking.prototype.process = function() {
  var length = Player.list.length;
  var buchholz = this.games.multvec(this.wins);
  var games = this.games.linesum();

  var absolute = {
    wins: this.wins,
    buchholz: buchholz,
    feinbuchholz: this.games.multvec(buchholz),
    netto: this.netto
  };

  var relative = {
    wins: Ranking.ArrayDivision(absolute.wins, games),
    buchholz: Ranking.ArrayDivision(absolute.buchholz, games),
    feinbuchholz: Ranking.ArrayDivision(absolute.feinbuchholz, games),
    netto: Ranking.ArrayDivision(absolute.netto, games)
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
    games: games,
    absolute: absolute,
    relative: relative
  };
};

Global = {
  tete: new Ranking(),
  doublette: new Ranking(),
  triplette: new Ranking(),

  addResult: function(team_a, team_b, score_a, score_b) {
    var len_a = team_a.length;
    var len_b = team_b.length;

    if (typeof team_a == 'number') {
      len_a = 1;
    }
    if (typeof team_b == 'number') {
      len_b = 1;
    }

    if (len_a !== len_b) {
      console.error('different team lengths when submitting results');
      return;
    }

    switch (len_a) {
    case 1:
      this.tete.addResult(team_a, team_b, score_a, score_b);
      break;
    case 2:
      this.doublette.addResult(team_a, team_b, score_a, score_b);
      break;
    case 3:
      this.triplette.addResult(team_a, team_b, score_a, score_b);
      break;
    default:
      console.error('invalid team lengths');
      break;
    }
  },

  getRanking: function() {
    this.updatePlayerCount();

    return {
      tete: this.tete.process(),
      doublette: this.doublette.process(),
      triplette: this.triplette.process()
    };
  },

  updatePlayerCount: function() {
    var len = Player.list.length;

    this.tete.games.extend(len);
    this.doublette.games.extend(len);
    this.triplette.games.extend(len);
  }
};

// test

new Player("Erik Lorenz\\1990\\Chemnitz\\BC");
new Player("Fabian Böttcher\\1988\\Chemnitz\\BC");
new Player("Rita Böttcher\\f1961\\Chemnitz\\BC");
new Player("Mario Bach\\1960\\Chemnitz\\BC");
new Player("Antje Müller\\1968\\Chemnitz\\BC");
new Player("Sabine Felber\\1990\\Chemnitz\\BC");

Global.updatePlayerCount();

Global.addResult([0], [1], 13, 7);
