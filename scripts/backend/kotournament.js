/**
 * KO tournament
 * 
 * Complies to Tournament and Blobber interfaces
 */

define([ './tournament', './map', './random', './game', './options' ], function (Tournament, Map, Random, Game, Options) {
  var KOTournament, rnd, match;

  rnd = new Random();

  function left (id) {
    return id * 2 + 1;
  }

  function right (id) {
    return id * 2 + 2;
  }

  function parent (id) {
    return Math.floor((id - 1) / 2);
  }

  function level (id) {
    return Math.floor(Math.log(id + 1) / Math.LN2);
  }

  function levelbynodes (numnodes) {
    if (numnodes > 0) {
      return Math.ceil(Math.log(numnodes) / Math.LN2) + 1;
    }
    return 0;
  }

  function nodesbylevel (level) {
    return 1 << level;
  }

  function numLevels (numnodes) {
    return Math.ceil(Math.log(numnodes + 1) / Math.LN2);
  }

  function numRounds (numplayers) {
    return levelbynodes(numplayers) - 1;
  }

  function worstplace (level) {
    return nodesbylevel(level + 1) - 1;
  }

  function lowestid (level) {
    return nodesbylevel(level) - 1;
  }

  KOTournament = function () {
    this.players = new Map();
    this.games = [];
    this.gameid = []; // the id of the game a player is in, or is *waiting for*
    this.state = Tournament.STATE.PREPARING;
    this.options = {
      firstround : 'set',
    };
  };

  KOTournament.OPTIONS = {
    // how the first game is determined
    // 'order': order of entry
    // 'set': first vs. last and so on
    // 'random': first matches are random
    firstround : {
      order : 'order',
      set : 'set',
      random : 'random',
    },
  };

  KOTournament.prototype.addPlayer = function (id) {
    if (this.state !== Tournament.STATE.PREPARING) {
      return undefined;
    }

    this.players.insert(id);
    return this;
  };

  /**
   * create an array of players where an even-indexed player and the subsequent
   * player are supposed to be in a game
   * 
   * @return an array of internal player ids
   */
  function matchOrder (numPlayers, byeOrder) {
    var numrounds, totalplayers, pids, i, numbyes;

    if (numPlayers < 2) {
      return undefined;
    }

    numbyes = 0;
    numrounds = numRounds(numPlayers);

    totalplayers = 1 << numrounds;

    pids = [];

    // set as many byes as possible
    for (i = 0; i < numPlayers;) {
      pids.push(i);
      i += 1;
      if (numPlayers - i > totalplayers - numPlayers - numbyes) {
        pids.push(i);
        i += 1;
      } else {
        pids.push(undefined);
        numbyes += 1;
      }
    }

    return pids;
  }

  /**
   * create a randomized first KO round by manipulating an array returned from
   * matchOrder()
   * 
   * @return an array of internal pids
   */
  function matchRandom (numPlayers, byeOrder) {
    var pids, availablePids, i;

    pids = matchOrder(numPlayers, byeOrder);
    availablePids = [];
    for (i = 0; i < numPlayers; i += 1) {
      availablePids.push(i);
    }

    for (i = 0; i < pids.length; i += 1) {
      if (pids[i]) {
        pids[i] = rnd.pickAndRemove(availablePids);
      }
    }

    return pids;
  }

  /**
   * create a set order (map)
   * 
   * This set order is achieved by repeated recursive permutations of a
   * previously sorted array of participating team ids
   * 
   * @return an array of indices for initial order
   */
  function createSetOrder (numrounds) {
    var ret, half, sum, index, numplayers;

    ret = [];
    numplayers = 1 << numrounds;
    sum = numplayers - 1;
    half = numplayers >> 1;
    index = 0;

    if (numplayers < 4) {
      for (; index < numplayers; index += 1) {
        ret.push(index);
      }
    } else {

      while (ret.length < numplayers) {
        ret.push(index);
        ret.push(sum - index);
        ret.push(index + half);
        ret.push(sum - index - half);

        index += 2;
      }
    }
    return ret;
  }

  /**
   * create a first round of games of players by permutation of matchOrder()
   * results
   * 
   * @return an array of internal pids
   */
  function matchSet (numPlayers, byeOrder) {
    var pids, order, i;

    pids = matchOrder(numPlayers, byeOrder);
    order = createSetOrder(numRounds(pids.length));

    for (i = 0; i < order.length; i += 1) {
      order[i] = pids[order[i]];
    }

    return order;
  }

  match = {};
  match[KOTournament.OPTIONS.firstround.order] = matchOrder;
  match[KOTournament.OPTIONS.firstround.set] = matchSet;
  match[KOTournament.OPTIONS.firstround.random] = matchRandom;

  KOTournament.prototype.start = function () {
    var i, pids, p1, p2, game, rounds, gameid;

    if (this.players.size < 2) {
      return undefined;
    }

    if (this.state !== Tournament.STATE.PREPARING) {
      return undefined;
    }

    rounds = numRounds(this.players.size());
    pids = match[this.options.firstround](this.players.size(), this.options.byeOrder);

    gameid = lowestid(rounds - 1);

    // create the games
    for (i = 0; i < pids.length; i += 2, gameid += 1) {
      p1 = pids[i];
      p2 = pids[i + 1];

      if (p1 === undefined && p2 === undefined) {
        this.gameid = [];
        this.games = [];
        console.error('cannot have a game where both players are byevotes');
        return undefined;
      }

      if (p1 === undefined) {
        checkforGame.call(this, p2, gameid);
        continue;
      }
      if (p2 === undefined) {
        checkforGame.call(this, p1, gameid);
        continue;
      }

      this.games.push(new Game(p1, p2, gameid));
      this.gameid[p1] = this.gameid[p2] = gameid;
    }

    // TODO set the byes!

    this.state = Tournament.STATE.RUNNING;

    return true;
  };

  KOTournament.prototype.end = function () {
    if (this.state !== Tournament.STATE.FINISHED) {
      return undefined;
    }

    // nothing to do here

    return this.getRanking();
  };

  KOTournament.prototype.finishGame = function (game, points) {
    var p1, p2, gameid, i, winner;

    if (this.state !== Tournament.STATE.RUNNING) {
      return undefined;
    }

    // abort if game has too many players
    if (game.teams[0].length !== 1 || game.teams[1].length !== 1) {
      return undefined;
    }

    // convert to internal pid
    p1 = this.players.find(game.teams[0][0]);
    p2 = this.players.find(game.teams[1][0]);

    if (p1 === -1 || p2 === -1) {
      // players don't exist in this tournament
      return undefined;
    }

    if (this.gameid[p1] !== this.gameid[p2]) {
      // players are not even in the same game!
      return undefined;
    }

    gameid = this.gameid[p1];

    if (points[0] > points[1]) {
      winner = p1;
    } else if (points[0] < points[1]) {
      winner = p2;
    } else {
      // points are equal
      return undefined;
    }

    for (i = 0; i <= this.games.length; i += 1) {
      if (i == this.games.length) {
        // couldn't find game

        return undefined;
      }
      if (this.games[i].teams[0][0] === p1 && this.games[i].teams[1][0] === p2) {
        this.games.splice(i, 1);
        break;
      }
    }

    checkforGame.call(this, winner, gameid);

    if (this.games.length === 0) {
      this.state = Tournament.STATE.FINISHED;
    }

    return this;
  };

  function checkforGame (pid, gameid) {
    var isleft, i, parentid, opponent;

    parentid = parent(gameid);
    this.gameid[pid] = parentid;

    if (parentid === -1) {
      return;
    }

    isleft = left(parentid) === gameid;

    opponent = this.gameid.indexOf(parentid);
    if (opponent === pid) {
      opponent = this.gameid.indexOf(parentid, pid + 1);
    }

    if (opponent > -1) {
      this.games.push(new Game((isleft ? pid : opponent), (isleft ? opponent : pid), parentid));
    }
  }

  KOTournament.prototype.getGames = function () {
    var games = [];

    this.games.forEach(function (game, i) {
      games[i] = new Game(this.players.at(game.teams[0][0]), this.players.at(game.teams[1][0]), game.id);
    }, this);

    return games;
  };

  KOTournament.prototype.getRanking = function () {
    var idmap, worstplaces, numplayers;

    worstplaces = [];
    idmap = [];

    while (idmap.length < this.players.size()) {
      worstplaces[idmap.length] = worstplace(level(this.gameid[idmap.length]));
      idmap.push(idmap.length);
    }

    idmap.sort(function (a, b) {
      return worstplaces[a] - worstplaces[b] || a - b;
    });

    numplayers = this.players.size();

    return {
      place : idmap.map(function (id) {
        return Math.min(numplayers - 1, worstplaces[id]);
      }), // actual place, usually [1, 2, 3, ...]. Necessary.
      ids : idmap.map(function (id) {
        return this.players.at(id);
      }, this), // sorted by place. Necessary
      round : 1, // always 1.
    };
  };

  KOTournament.prototype.rankingChanged = function () {
    // TODO differentiate
    return true;
  };

  KOTournament.prototype.getState = function () {
    return this.state;
  };

  KOTournament.prototype.correct = function () {
    // TODO how to correct a KO tournament?
    return false;
  };

  KOTournament.prototype.toBlob = function () {
    var ob;

    ob = {
      players : this.players.toBlob(),
      games : this.games,
      gameid : this.gameid,
      state : this.state,
      options : this.getOptions(),
    };

    return JSON.stringify(ob);
  };

  KOTournament.prototype.fromBlob = function (blob) {
    var ob;

    ob = JSON.parse(blob);

    this.players.fromBlob(ob.players);
    this.games = ob.games;
    this.gameid = ob.gameid;
    this.state = ob.state;
    this.setOptions(ob.options);
  };

  KOTournament.prototype.getOptions = Options.prototype.getOptions;
  KOTournament.prototype.setOptions = Options.prototype.setOptions;
  KOTournament.prototype.getType = function () {
    return 'ko';
  };

  KOTournament.prototype.getCorrections = function () {
    // TODO use and return actual corrections
    return [];
  };

  return KOTournament;
});
