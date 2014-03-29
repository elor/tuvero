/**
 * KO tournament
 * 
 * Complies to Tournament and Blobber interfaces
 */

define([ './tournament', './map', './random', './game' ], function (Tournament, Map, Random, Game) {
  var KOTournament, rnd, match;

  function KOGame (round) {
    if (round !== undefined) {
      this.round = round;
    }
    return this;
  }
  KOGame.bye = -1;
  KOGame.ids = [ 'p1', 'p2' ];
  KOGame.prototype = {
    round : -1, // the round of this game
    p1 : undefined, // internal id of player 1
    p2 : undefined, // internal id of player 2
    winner : undefined, // KOGame reference where the winner goes
    loser : undefined, // KOGame reference where the loser goes
    nextId : 0, // 0 or 1
  // the next game
  };

  KOGame.prototype.clone = function () {
    var ret, key;
    ret = new KOGame();
    for (key in this) {
      ret[key] = this[key];
    }
    return ret;
  };
  KOGame.prototype.next = function () {
    // returns the next id
    return KOGame.ids[this.nextId];
  };
  KOGame.prototype.toString = function () {
    return [ 'Game( ', this.p1, 'vs', this.p2, ' @ ', this.round, ' )' ].join('');
  };

  rnd = new Random();

  KOTournament = function () {
    this.players = new Map();
    this.games = [];
    this.rounds = 0;
    this.state = Tournament.STATE.PREPARING;
    this.options = {
      initialMatching : 'order',
      loserMatchMinRound : 1,
      byeOrder : 'first'
    };
  };

  KOTournament.OPTIONS = {
    // how the first game is determined
    // 'order': order of entry
    // 'shifted': first vs. last and so on
    // 'random': first matches are random
    initialMatching : {
      order : 'order',
      shifted : 'shifted',
      random : 'random',
    },

    // let losers play if they reached this round
    // 0: never
    // 1: 'third place' match
    // 2: up to seventh place
    loserMatchMinRound : [ 0, 1, 2, 3, 4 ], // 5...

    // when to set byes
    // 'first': add all byes in the first round
    // 'later': let as many players play as possible
    byeOrder : {
      first : 'first',
      later : 'later',
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
   * returns the number of necessary rounds to get a clear winner. obviously
   * based on logarithms
   * 
   * @returns the number of necessary rounds or undefined on failure
   */
  function numRounds (numplayers) {
    if (numplayers >= 1) {
      return Math.ceil(Math.log(numplayers) / Math.log(2));
    }
    return undefined;
  }

  /**
   * create an array of players where an even-indexed player and the subsequent
   * player are supposed to be in a game
   * 
   * @returns an array of internal player ids
   */
  function matchOrder (numPlayers, byeOrder) {
    var numrounds, totalplayers, pids, i, numbyes;

    if (numPlayers < 2) {
      return undefined;
    }

    numbyes = 0;
    numrounds = numRounds(numPlayers);

    // totalplayers = Math.round(Math.pow(2, numrounds));
    totalplayers = 1 << numrounds;

    pids = [];

    switch (byeOrder) {
    case KOTournament.OPTIONS.byeOrder.first:
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
      break;
    case KOTournament.OPTIONS.byeOrder.later:
      for (i = 0; i < numPlayers; i += 1) {
        pids.push(i);
      }
      // just add all byes to the end
      for (i = numPlayers; i < totalplayers; i += 1) {
        pids.push(undefined);
      }
      break;
    default:
      return undefined;
    }

    return pids;
  }

  /**
   * create a randomized first KO round by manipulating an array returned from
   * matchOrder()
   * 
   * @returns an array of internal pids
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
   * create a shifted order (map)
   * 
   * @return an array of indices for initial order
   */
  function createShiftedOrder (numrounds) {
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
   * @returns an array of internal pids
   */
  function matchShifted () {
    var pids, order, i;

    pids = matchOrder.call(this);
    order = createShiftedOrder(numRounds(pids.length));

    for (i = 0; i < order.length; i += 1) {
      order[i] = pids[order[i]];
    }

    return order;
  }

  match = {};
  match[KOTournament.OPTIONS.initialMatching.order] = matchOrder;
  match[KOTournament.OPTIONS.initialMatching.shifted] = matchShifted;
  match[KOTournament.OPTIONS.initialMatching.random] = matchRandom;

  function buildTree (numRounds, loserMinRound) {
    var games, nextRoundWinners, nextRoundLosers, i, numgames, thisRound;

    if (!numRounds) {
      return undefined;
    }
    if (numRounds === 1) {
      return [ new KOGame(0) ];
    }

    nextRoundWinners = buildTree(numRounds - 1, loserMinRound);
    if (numRounds - 1 < loserMinRound) {
      nextRoundLosers = buildTree(numRounds - 1, loserMinRound);
    }

    thisRound = numRounds - 1;

    games = [];
    numgames = 1 << thisRound;

    for (i = 0; i < numgames; i += 1) {
      games[i] = new KOGame(thisRound);
      if (nextRoundWinners) {
        games[i].winner = nextRoundWinners[i >> 1];
      }
      if (nextRoundLosers) {
        games[i].loser = nextRoundLosers[i >> 1];
      }
      games[i].nextId = (i % 2);
    }

    return games;
  }

  function startKOGame (game) {
    if (game.p1 !== undefined && game.p2 !== undefined) {
      if (this.games.indexOf(game) === -1) {
        this.games.push(game);
      }
    }
  }

  function finishKOGame (game, winner) {
    var loser, id;

    id = this.games.indexOf(game);
    if (id === -1) {
      return undefined;
    }

    if (game.p1 === winner) {
      loser = game.p2;
    } else if (game.p2 === winner) {
      loser = game.p1;
    } else {
      // TODO throw an error or something
      return undefined;
    }

    // remove the finished game
    this.games.splice(id, 1);
    if (game.winner) {
      game.winner[game.next()] = winner;
      startKOGame.call(this, game.winner);
    }
    if (game.loser) {
      game.loser[game.next()] = loser;
      startKOGame.call(this, game.loser);
    }
  }

  function applyBye (game) {
    var gid;

    if (!game) {
      return;
    }

    gid = this.games.indexOf(game);
    if (gid === -1) {
      return;
    }

    if (game.p2 === KOGame.bye) {
      if (game.p1 !== undefined) {
        finishKOGame.call(this, game, game.p1);
        applyBye.call(this, game);
      }
    } else if (game.p1 === KOGame.bye) {
      if (game.p2 !== undefined) {
        finishKOGame.call(this, game, game.p2);
        applyBye.call(this, game);
      }
    } else {
      // there was no bye.
    }
  }

  function applyAllByes () {
    var i;

    // reverse iteration to avoid invalid indexing due to deleted entries
    for (i = this.games.length - 1; i > 0; i -= 1) {
      applyBye.call(this, this.games[i]);
    }
  }

  KOTournament.prototype.start = function () {
    var i, pids, p1, p2, game;

    if (this.players.size < 2) {
      return undefined;
    }

    if (this.state !== Tournament.STATE.PREPARING) {
      return undefined;
    }

    this.rounds = numRounds(this.players.size());
    this.matches = [];
    pids = match[this.options.initialMatching](this.players.size(), this.options.byeOrder);

    for (i = 1; i < this.rounds; i += 1) {
      this.matches[i] = (new Array(1 << (this.rounds - i))).map(function () {
        return -1;
      });
    }

    // build the game tree
    this.games = buildTree(this.rounds, this.options.loserMatchMinRound);

    // enter the players
    for (i = 0; i < pids.length; i += 2) {
      p1 = pids[i];
      p2 = pids[i + 1];
      if (p1 === undefined) {
        p1 = KOGame.bye;
      }
      if (p2 === undefined) {
        p2 = KOGame.bye;
      }

      game = this.games[i >> 1];

      game.p1 = p1;
      game.p2 = p2;
    }

    applyAllByes.call(this);

    console.log(pids);
    console.log(this.games.join(' , '));

    this.state = Tournament.STATE.RUNNING;
    return this;
  };

  KOTournament.prototype.end = function () {
    if (this.state !== Tournament.STATE.FINISHED) {
      return undefined;
    }
    return this.getRanking();
  };

  KOTournament.prototype.finishGame = function (game, points) {
    if (this.state !== Tournament.STATE.RUNNING) {
      return undefined;
    }

    // TODO update the list of games and stuff
    return this;
  };

  KOTournament.prototype.getGames = function () {
    var games = [];
    this.games.forEach(function (game, i) {
      games[i] = new Game(this.players.at(game.teams[0][0]), this.players.at(game.teams[1][0]));
    }, this);

    return games;
  };

  KOTournament.prototype.getRanking = function () {
    // TODO create sorted ranking and stuff
    return {
      place : [], // actual place, usually [1, 2, 3, ...]. Necessary.
      ids : [], // sorted for ranking. Necessary
      mydata : [], // optional numerical data, e.g. points
      mydata2 : [], // same indices as place[] and ids[]
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
    return false;
  };

  KOTournament.prototype.toBlob = function () {
    // TODO
    return undefined;
  };

  KOTournament.prototype.fromBlob = function () {
    return undefined;
  };

  KOTournament.prototype.getOptions = function () {
    var key, ret;

    ret = {};
    for (key in this.options) {
      // FIXME only works for non-referenced values
      ret[key] = options[key];
    }

    return ret;
  };

  KOTournament.prototype.setOptions = function (options) {
    var key;

    for (key in options) {
      if (!options.hasOwnProperty(key)) {
        return false;
      }
    }

    // TODO compare types

    for (key in this.options) {
      // TODO deep copy
      this.options[key] = options[key];
    }
  };

  KOTournament.prototype.getCorrections = function () {
    // TODO return corrections
    return [];
  };

  return KOTournament;
});
