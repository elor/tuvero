var Ranking = {
  Interface : {
    get : function() {
      return new Map();
    }
  },
};

function Ranking(string) {
  this.games = new Square();

  if (string) {
    this.fromString(string);
  } else {
    this.wins = [];
    this.netto = [];
  }
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
};

Ranking.ArrayScalarDivision = function(a, b) {
  var length = a.length;
  var ret = [];
  var i;

  for (i = 0; i < length; ++i) {
    ret[i] = a[i] / b;
  }

  return ret;
};

Ranking.prototype.toString = function() {
  return [ ArrayToString(this.wins), ArrayToString(this.netto),
      this.games.toTriString() ].join('\n');
};

Ranking.prototype.fromString = function(string) {
  var lines = string ? string.split('\n') : [];
  this.wins = ArrayFromString(lines.shift());
  this.netto = ArrayFromString(lines.shift());
  this.games.fromString(lines.join('\n'));

  return this;
};

Ranking.prototype.addResult = function(team_a, team_b, score_a, score_b) {
  var diff = score_b - score_a;
  var a_wins = diff < 0;

  var size_a, size_b;
  var i, j;
  var a, b;

  if (typeof team_a == "number") {
    team_a = [ team_a ];
  }
  if (typeof team_b == "number") {
    team_b = [ team_b ];
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

Ranking.prototype.process = function(teamsize) {
  teamsize = teamsize || 1;
  var length = Player.list.length;
  var buchholz = this.games.multvec(this.wins);
  var games = Ranking.ArrayScalarDivision(this.games.linesum(), teamsize);

  var abs = {
    wins : this.wins,
    buchholz : buchholz,
    feinbuchholz : this.games.multvec(buchholz),
    netto : this.netto,
    ranking : []
  };

  var rel = {
    wins : Ranking.ArrayDivision(abs.wins, games),
    buchholz : Ranking.ArrayDivision(abs.buchholz, games),
    feinbuchholz : Ranking.ArrayDivision(abs.feinbuchholz, games),
    netto : Ranking.ArrayDivision(abs.netto, games),
    ranking : []
  };

  var abssort = function(a, b) {
    return ((abs.wins[b] || 0) - (abs.wins[a] || 0))
        || (abs.buchholz[b] - abs.buchholz[a])
        || (abs.feinbuchholz[b] - abs.feinbuchholz[a])
        || (abs.netto[b] - abs.netto[a]) || (games[b] - games[a]) || (a - b);
  };
  var relsort = function(a, b) {
    return ((rel.wins[b] || 0) - (rel.wins[a] || 0))
        || (rel.buchholz[b] - rel.buchholz[a])
        || (rel.feinbuchholz[b] - rel.feinbuchholz[a])
        || (rel.netto[b] - rel.netto[a]) || (games[b] - games[a]) || (a - b);
  };

  var a = abs.ranking;
  var r = rel.ranking;
  var i;
  for (i = 0; i < length; ++i) {
    if (games[i]) {
      a.push(i);
      r.push(i);
    }
  }

  a.sort(abssort);
  r.sort(relsort);

  return {
    games : games,
    abs : abs,
    rel : rel
  };
};

Global = {
  tete : new Ranking(),
  doublette : new Ranking(),
  triplette : new Ranking(),

  toString : function() {
    var str = [ this.tete.toString(), this.doublette.toString(),
        this.triplette.toString() ].join('--\n');
    if (str === "\n\n--\n\n\n--\n\n\n") {
      return undefined;
    } else {
      return str;
    }
  },

  fromString : function(str) {
    var tmp = str ? str.split('--\n') : [];
    this.tete.fromString(tmp.shift());
    this.doublette.fromString(tmp.shift());
    this.triplette.fromString(tmp.shift());

    return this;
  },

  addResult : function(team_a, team_b, score_a, score_b) {
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

  getRanking : function() {
    this.updatePlayerCount();

    return {
      tete : this.tete.process(1),
      doublette : this.doublette.process(2),
      triplette : this.triplette.process(3)
    };
  },

  updatePlayerCount : function() {
    var len = Player.list.length;

    this.tete.games.extend(len);
    this.doublette.games.extend(len);
    this.triplette.games.extend(len);
  }
};
