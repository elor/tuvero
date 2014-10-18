define(function () {
  /**
   * NettoRanking: A ranking variant which sorts players by wins and netto
   * points, in this order.
   */
  var Netto = function (size) {
    this.wins = [];
    this.netto = [];
    this.byes = [];
    this.corrections = [];

    while (this.netto.length < size) {
      this.netto.push(0);
      this.wins.push(0);
      this.byes.push(0);
    }
  };

  /**
   * simply return the stored size
   * 
   * @return the size
   */
  Netto.prototype.size = function () {
    return this.netto.length;
  };

  /**
   * resize the internal arrays
   * 
   * @param size
   *          new size
   * @return {Netto} this
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
   * @return {Object} the return object
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
   * @return {Netto} this
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
   * @return {Netto} this
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
   * @param correction
   *          the correction
   * @return {Netto} this
   */
  Netto.prototype.correct = function (correction) {
    if (this.added(correction.pre.getGame())) {
      this.remove(correction.pre);
      this.add(correction.post);

      this.corrections.push(correction.copy());

      return this;
    }

    return undefined;
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

  /**
   * get a copy of the applied corrections
   * 
   * @return copy of the array of corrections
   */
  Netto.prototype.getCorrections = function () {
    return this.corrections.map(function (corr) {
      return corr.copy();
    }, this);
  };

  /**
   * whether the game took place
   * 
   * @param game
   *          the game in question
   * @return {Boolean} true if the game is likely to have been added, false
   *          otherwise
   */
  Netto.prototype.added = function (game) {
    var valid, failure, len;

    valid = false;
    failure = false;
    len = this.wins.length;

    // ideas:
    // every player of one team must have won
    // additionally, players without wins must have negative netto score
    game.teams.forEach(function (team) {
      var invalid = false;
      if (!failure) {
        team.forEach(function (pid) {
          if (pid >= len || pid < 0) {
            failure = true;
            return;
          }

          if (this.wins[pid] <= 0) {
            invalid = true;
            if (this.netto[pid] >= 0) {
              failure = true;
            }
          }
        }, this);
      }

      if (!invalid) {
        valid = true;
      }
    }, this);

    return !failure && valid;
  };

  /**
   * stores the current state in a blob
   * 
   * @return the blob
   */
  Netto.prototype.toBlob = function () {
    var ob;

    ob = {
      byes : this.byes,
      corrections : this.corrections,
      netto : this.netto,
      wins : this.wins
    };

    return JSON.stringify(ob);
  };

  Netto.prototype.fromBlob = function (blob) {
    var ob;

    function copyCorrection (corr) {
      return Correction.copy(corr);
    }

    ob = JSON.parse(blob);

    this.byes = ob.byes;
    this.netto = ob.netto;
    this.wins = ob.wins;

    this.corrections = ob.corrections.map(copyCorrection);
  };

  return Netto;
});
