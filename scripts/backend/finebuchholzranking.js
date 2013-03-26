define([ 'vector', 'matrix', 'halfmatrix' ], function (Vector, Matrix,
    HalfMatrix) {
  /**
   * FinebuchholzRanking: A ranking variant which sorts players by wins,
   * buchholz points, finebuchholz points and netto points, in this order.
   */
  var Finebuchholz = function (size) {
    this.wins = [];
    this.netto = [];
    this.byes = [];
    this.games = new HalfMatrix(HalfMatrix.mirrored, size);

    while (this.netto.length < size) {
      this.netto.push(0);
      this.wins.push(0);
      this.byes.push(0);
    }
  };

  /**
   * simply return the stored size
   * 
   * @returns the size
   */
  Finebuchholz.prototype.size = function () {
    return this.netto.length;
  };

  /**
   * resize the internal structures
   * 
   * @param size
   *          new size
   * @returns {Finebuchholz} this
   */
  Finebuchholz.prototype.resize = function (size) {
    var length = this.size();

    if (size < length) {
      this.netto.splice(size);
      this.wins.splice(size);
      this.byes.splice(size);
      while (this.games.size > size) {
        this.games.erase(size);
      }
    } else {
      this.games.extend(size - length);

      for (; length < size; length += 1) {
        this.netto.push(0);
        this.wins.push(0);
        this.byes.push(0);
      }
    }

    return this;
  };

  /**
   * return an object containing all points data and a sorted array of pids
   * representing the ranking
   * 
   * @returns data object
   */
  Finebuchholz.prototype.get = function () {
    var rank, i, n, w, bh, fbh;

    n = this.netto;
    w = this.wins;
    bh = Matrix.multVec(this.games, w); // calculate the buchholz points
    fbh = Matrix.multVec(this.games, bh); // calculate the finebuchholz points

    rank = [];
    for (i = 0; i < n.length; i += 1) {
      rank[i] = i;
    }

    rank.sort(function (a, b) {
      return (w[b] - w[a]) || (bh[b] - bh[a]) || (fbh[b] - fbh[a])
          || (n[b] - n[a]);
    });

    return {
      buchholz : bh,
      byes : this.byes,
      finebuchholz : fbh,
      netto : n,
      ranking : rank,
      size : n.length,
      wins : w
    };
  };

  /**
   * Add the result of a game to the ranking table.
   * 
   * @param result
   *          the result
   * @returns {Finebuchholz} this
   */
  Finebuchholz.prototype.add = function (result) {
    var netto, n, w, g, t1, t2;

    n = this.netto;
    w = this.wins;
    g = this.games;

    netto = result.getNetto();
    t1 = result.getTeam(1);
    t2 = result.getTeam(2);

    t1.map(function (v) {
      n[v] += netto;
      if (netto > 0) {
        w[v] += 1;
      }

      t2.map(function (v2) {
        g.set(v, v2, g.get(v, v2) + 1);
      });
    });

    t2.map(function (v) {
      n[v] -= netto;
      if (netto < 0) {
        w[v] += 1;
      }
    });

    return this;
  };

  /**
   * remove the result of a game from the ranking table
   * 
   * @param result
   *          the result
   * @returns {Finebuchholz} this
   */
  Finebuchholz.prototype.remove = function (result) {
    var netto, n, w, g, t1, t2;

    n = this.netto;
    w = this.wins;
    g = this.games;

    netto = result.getNetto();
    t1 = result.getTeam(1);
    t2 = result.getTeam(2);

    t1.map(function (v) {
      n[v] -= netto;
      if (netto > 0) {
        w[v] -= 1;
      }

      t2.map(function (v2) {
        g.set(v, v2, g.get(v, v2) - 1);
      });
    });

    t2.map(function (v) {
      n[v] += netto;
      if (netto < 0) {
        w[v] -= 1;
      }
    });

    return this;
  };

  /**
   * Correct the result of a game.
   * 
   * @param oldres
   *          the old result
   * @param newres
   *          the new (corrected) result
   * @returns {Finebuchholz} this
   */
  Finebuchholz.prototype.correct = function (oldres, newres) {
    this.remove(oldres);
    this.add(newres);

    return this;
  };

  Finebuchholz.prototype.grantBye = function (team) {
    var n, w, b, size;

    if (typeof team === 'number') {
      team = [ team ];
    }

    n = this.netto;
    w = this.wins;
    b = this.byes;

    size = this.size();

    team.forEach(function (pid) {
      if (pid < size) {
        n[pid] += 6; // win 13 to 7
        w[pid] += 1; // win against nobody
        b[pid] += 1; // keep track of the byes
      }
    }, this);
  };

  Finebuchholz.prototype.revokeBye = function (team) {
    var n, w, size;

    if (typeof team === 'number') {
      team = [ team ];
    }

    n = this.netto;
    w = this.wins;
    b = this.byes;

    size = this.size();

    team.forEach(function (pid) {
      if (pid < size && b[pid] > 0) {
        n[pid] -= 6; // revoke a win of 13 to 7
        w[pid] -= 1; // revoke a win against nobody
        b[pid] -= 1; // keep track of byes
      }
    }, this);
  };

  /**
   * whether a game was played
   * 
   * @param game
   *          an instance of the game that could have taken place
   * @returns true if all data indicates that this game took place, false
   *          otherwise.
   */
  Finebuchholz.prototype.wasPlayed = function (game) {
    // if a game has taken place, all players of one team have played against
    // all players of another team.
    var len, i, j, t1, t2, t1func, invalid;

    invalid = false;

    // jslint false positive
    t1 = t2 = [];

    t1func = function (p1) {
      t2.forEach(function (p2) {
        if (this.games.get(p1, p2) <= 0) {
          invalid = true;
        }
      }, this);
    };

    len = game.teams.length;

    for (i = 0; i < len; i += 1) {
      t1 = game.teams[i];
      for (j = i + 1; j < len; j += 1) {
        t2 = game.teams[j];

        t1.forEach(t1func, this);
        if (invalid) {
          break;
        }
      }
      if (invalid) {
        break;
      }
    }

    return !invalid;
  };

  return Finebuchholz;
});
