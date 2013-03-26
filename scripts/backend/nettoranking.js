define(function () {
  /**
   * NettoRanking: A ranking variant which sorts players by wins and netto
   * points, in this order.
   */
  var Netto = function (size) {
    this.wins = [];
    this.netto = [];
    this.byes = [];

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
  Netto.prototype.size = function () {
    return this.netto.length;
  };

  /**
   * resize the internal arrays
   * 
   * @param size
   *          new size
   * @returns {Netto} this
   */
  Netto.prototype.resize = function (size) {
    var length = this.size();

    if (size < length) {
      this.netto.splice(size);
      this.wins.splice(size);
      this.byes.splice(size);
    } else {
      for (; length < size; length += 1) {
        this.netto.push(0);
        this.wins.push(0);
        this.byes.push(0);
      }
    }

    return this;
  };

  /**
   * return an object with ranking-specific data.
   * 
   * @returns {Object} the return object
   */
  Netto.prototype.get = function () {
    var rank, i, n, w;

    n = this.netto;
    w = this.wins;

    rank = [];
    for (i = 0; i < n.length; i += 1) {
      rank[i] = i;
    }

    rank.sort(function (a, b) {
      return (w[b] - w[a]) || (n[b] - n[a]);
    });

    return {
      byes : this.byes,
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
   * @returns {Netto} this
   */
  Netto.prototype.add = function (result) {
    var netto, n, w;

    n = this.netto;
    w = this.wins;
    netto = result.getNetto();
    result.getTeam(1).map(function (v) {
      n[v] += netto;
      if (netto > 0) {
        w[v] += 1;
      }
    });

    result.getTeam(2).map(function (v) {
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
   * @returns {Netto} this
   */
  Netto.prototype.remove = function (result) {
    var netto, n, w;

    n = this.netto;
    w = this.wins;
    netto = result.getNetto();
    result.getTeam(1).map(function (v) {
      n[v] -= netto;
      if (netto > 0) {
        w[v] -= 1;
      }
    });

    result.getTeam(2).map(function (v) {
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
   * @returns {Netto} this
   */
  Netto.prototype.correct = function (oldres, newres) {
    this.remove(oldres);
    this.add(newres);

    return this;
  };

  Netto.prototype.grantBye = function (team) {
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

  Netto.prototype.revokeBye = function (team) {
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

  return Netto;
});
