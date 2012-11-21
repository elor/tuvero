define(function () {
  var Netto = function (size) {
    var i;
    this.size = size;
    this.netto = [];
    
    while (this.netto.length < this.size) {
      this.netto.push(0);
    }
  };

  /**
   * simply return the stored size
   * 
   * @returns the size
   */
  Netto.prototype.getSize = function () {
    return this.size;
  };

  /**
   * return an array of sorted player ids representing the ranking.
   * 
   * @returns {Array[Integer]} the ranking
   */
  Netto.prototype.getRanking = function () {
    var ranking, n;

    ranking = [];
    for (n = 0; n < this.size; n += 1) {
      ranking[n] = n;
    }

    n = this.netto;

    ranking.sort(function (a, b) {
      return n[b] - n[a];
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
    var netto, n;

    n = this.netto;
    netto = result.getNetto();
    result.getTeam(1).map(function (v) {
      n[v] = n[v] + netto;
    });

    result.getTeam(2).map(function (v) {
      n[v] = n[v] - netto;
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
    var netto, n;

    n = this.netto;
    netto = result.getNetto();
    result.getTeam(1).map(function (v) {
      n[v] = n[v] - netto;
    });

    result.getTeam(2).map(function (v) {
      n[v] = n[v] + netto;
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
