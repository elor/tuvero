define([ 'vector', 'matrix', 'halfmatrix' ], function (Vector, Matrix,
    HalfMatrix) {
  /**
   * BuchholzRanking: A ranking variant which sorts players by wins, buchholz
   * points and netto points, in this order.
   */
  var Buchholz = function (size) {
    this.wins = [];
    this.netto = [];
    this.games = new HalfMatrix(HalfMatrix.mirrored, size);

    while (this.netto.length < size) {
      this.netto.push(0);
      this.wins.push(0);
    }
  };

  /**
   * simply return the stored size
   * 
   * @returns the size
   */
  Buchholz.prototype.size = function () {
    return this.netto.length;
  };

  /**
   * resize the internal structures
   * 
   * @param size
   *          new size
   * @returns {Buchholz} this
   */
  Buchholz.prototype.resize = function (size) {
    var length = this.netto.length;

    if (size < length) {
      this.netto.splice(size);
      this.wins.splice(size);
      while (this.games.size > size) {
        this.games.erase(size);
      }
    } else {
      this.games.extend(size - length);

      for (; length < size; length += 1) {
        this.netto.push(0);
        this.wins.push(0);
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
  Buchholz.prototype.get = function () {
    var rank, i, n, w, bh;

    n = this.netto;
    w = this.wins;
    bh = Matrix.multVec(this.games, w); // calculate the buchholz points

    rank = [];
    for (i = 0; i < n.length; i += 1) {
      rank[i] = i;
    }

    rank.sort(function (a, b) {
      return (w[b] - w[a]) || (bh[b] - bh[a]) || (n[b] - n[a]);
    });

    return {
      buchholz : bh,
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
   * @returns {Buchholz} this
   */
  Buchholz.prototype.add = function (result) {
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
  Buchholz.prototype.remove = function (result) {
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
  Buchholz.prototype.correct = function (oldres, newres) {
    this.remove(oldres);
    this.add(newres);

    return this;
  };

  return Buchholz;
});
