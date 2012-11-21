define([ 'vector', 'matrix', 'halfmatrix' ], function (Vector, Matrix,
    HalfMatrix) {
  /**
   * BuchholzRanking: A ranking variant which sorts players by wins, buchholz
   * points and netto points, in this order.
   */
  var Buchholz = function (size) {
    this.wins = [];
    this.netto = [];
    this.games = new HalfMatrix(1, size);

    while (this.netto.length < size) {
      this.netto.push(0);
      this.wins.push(0);
    }
  };

  /**
   * get wins of a player
   * 
   * @param pid
   *          player id
   * @returns number of wins
   */
  Buchholz.prototype.getWins = function (pid) {
    return this.wins[pid];
  };

  /**
   * get netto points of a player
   * 
   * @param pid
   *          player id
   * @returns netto points
   */
  Buchholz.prototype.getNetto = function (pid) {
    return this.netto[pid];
  };

  /**
   * get buchholz points of a player
   * 
   * @param pid
   *          player id
   * @returns buchholz points
   */
  Buchholz.prototype.getBuchholz = function (pid) {
    // get the number of games this player played against the other players
    var games = Matrix.getRow(this.games, pid);
    // calculate the buchholz points by multiplying the games against a player
    // with his wins. This is equivalent to iterating over every game
    return Vector.dot(this.wins, games);
  };

  /**
   * simply return the stored size
   * 
   * @returns the size
   */
  Buchholz.prototype.getSize = function () {
    return this.netto.length;
  };

  /**
   * return an array of sorted player ids representing the ranking.
   * 
   * @returns {Array[Integer]} the ranking
   */
  Buchholz.prototype.getRanking = function () {
    var ranking, i, n, w, bh;

    n = this.netto;
    w = this.wins;
    bh = Matrix.multVec(this.games, w); // calculate the buchholz points

    ranking = [];
    for (i = 0; i < n.length; i += 1) {
      ranking[i] = i;
    }

    ranking.sort(function (a, b) {
      return (w[b] - w[a]) || (bh[b] - bh[a]) || (n[b] - n[a]);
    });

    return ranking;
  };

  /**
   * Add the result of a game to the ranking table.
   * 
   * @param result
   *          the result
   * @returns {Buchholz} this
   */
  Buchholz.prototype.addResult = function (result) {
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
   * @returns {Buchholz} this
   */
  Buchholz.prototype.eraseResult = function (result) {
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
   * @returns {Buchholz} this
   */
  Buchholz.prototype.correctResult = function (oldres, newres) {
    this.eraseResult(oldres);
    this.addResult(newres);

    return this;
  };

  return Buchholz;
});
