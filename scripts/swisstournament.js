/**
 * Implementation of the swiss tournament system
 */
define([ 'map', 'finebuchholzranking', 'game', 'result' ], function (Map,
    Finebuchholzranking, Game, Result) {
  var Swisstournament;

  Swisstournament = function () {
    this.players = new Map();
    this.ranking = new Finebuchholzranking();
    this.state = 0; // 0 always is the first state, regardless of its name
    this.games = [];
    this.upvote = []; // true, wenn jemand hochgelost wurde
    this.downvote = []; // true, wenn jemand runtergelost wurde
    this.byevote = []; // true, wenn jemand ein Freilos bekommen hat
  };

  Swisstournament.state = {
    PREPARING : 0,
    RUNNING : 1,
    FINISHED : 2
  };

  Swisstournament.prototype.addPlayer = function (id) {
    if (this.state !== Swisstournament.state.PREPARING) {
      return undefined;
    }

    this.players.insert(id);
    return this;
  };

  Swisstournament.prototype.start = function () {
    if (this.state !== Swisstournament.state.PREPARING) {
      return undefined;
    }

    this.state = Swisstournament.state.RUNNING;
    this.randomizeGames();

    return this;
  };

  Swisstournament.prototype.end = function () {
    if (this.state !== Swisstournament.state.RUNNING) {
      return undefined;
    }

    // check for running games
    if (this.games.length !== 0) {
      return undefined;
    }

    this.state = Swisstournament.state.FINISHED;
    return this.getRanking();
  };

  Swisstournament.prototype.finishGame = function (game, points) {
    var t1, t2, i, invalid;
    if (this.state !== Swisstournament.state.RUNNIG) {
      return undefined;
    }

    // verify that the game is in the games list
    invalid = true;
    for (i = 0; i < this.games.length; i += 1) {
      if (game.equal(this.games[i])) {
        invalid = false;
        break;
      }
    }

    if (invalid === true) {
      return undefined;
    }

    t1 = [];
    t2 = [];

    // ids are external. Convert them to internal ids
    for (i = 0; i < game.teams[0].length; i += 1) {
      t1[i] = this.players.find(game.teams[0][i]);
      t2[i] = this.players.find(game.teams[1][i]);
    }

    // apply ranking
    this.ranking.add(new Ranking(t1, t2, points[0], points[1]));

    return this;
  };

  Swisstournament.prototype.openGames = function () {
    // return array of open games. Referenced, because bad code
    return this.games;
  };

  Swisstournament.prototype.getRanking = function () {
    var res, wins, netto, bh, fbh, ids, i, rank;

    bh = [];
    fbh = [];
    ids = [];
    netto = [];
    wins = [];

    res = this.ranking.get();

    // rearrange the arrays from internal id indexing to ranked indexing
    for (i = 0; i < res.size; i += 1) {
      rank = res.ranking[i];

      bh[rank] = res.buchholz[i];
      fbh[rank] = res.finebuchholz[i];
      netto[rank] = res.netto[i];
      wins[rank] = res.wins[i];
    }

    return {
      bh : bh,
      fbh : fbh,
      ids : ids,
      netto : netto,
      wins : wins
    };
  };

  Swisstournament.prototype.randomizeGames = function () {
    if (this.games.length !== 0) {
      return undefined;
    }

    // TODO invent a simple algorithm for getting new games

    return this.games;
  };

  return Swisstournament;
});
