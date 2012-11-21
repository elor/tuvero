define(function () {
  /**
   * NettoRanking: A ranking variant which sorts players by wins and netto
   * points, in this order.
   */
  var Netto = function (size) {
    this.wins = [];
    this.netto = [];

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
  Netto.prototype.getWins = function (pid) {
    return this.wins[pid];
  };

  /**
   * get netto points of a player
   * 
   * @param pid
   *          player id
   * @returns netto points
   */
  Netto.prototype.getNetto = function (pid) {
    return this.netto[pid];
  };

  /**
   * simply return the stored size
   * 
   * @returns the size
   */
  Netto.prototype.getSize = function () {
    return this.netto.length;
  };

  /**
   * return an array of sorted player ids representing the ranking.
   * 
   * @returns {Array[Integer]} the ranking
   */
  Netto.prototype.getRanking = function () {
    var ranking, i, n, w;

    n = this.netto;
    w = this.wins;

    ranking = [];
    for (i = 0; i < n.length; i += 1) {
      ranking[i] = i;
    }

    ranking.sort(function (a, b) {
      return (w[b] - w[a]) || (n[b] - n[a]);
    });

    return ranking;
  };

  /**
   * Add the result of a game to the ranking table.
   * 
   * @param result
   *          the result
   * @returns {Netto} this
   */
  Netto.prototype.addResult = function (result) {
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
  Netto.prototype.eraseResult = function (result) {
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
  Netto.prototype.correctResult = function (oldres, newres) {
    this.eraseResult(oldres);
    this.addResult(newres);

    return this;
  };

  return Netto;
});
