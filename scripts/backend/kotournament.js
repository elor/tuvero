/**
 * KO tournament
 * 
 * Complies to Tournament and Blobber interfaces
 */

define([ , './tournament', './map', './random', './game' ], function (Tournament, Map, Random, Game) {
  var KOTournament;

  KOTournament = function () {
    this.players = new Map();
    this.rnd = new Random();
    this.games = [];
    this.byes = [];
    this.state = Tournament.STATE.PREPARING;
    this.options = {};
  };

  KOTournament.prototype.addPlayer = function (id) {
    if (state !== Tournament.STATE.PREPARING) {
      return undefined;
    }

    this.players.insert(id);
    return this;
  };

  KOTournament.prototype.start = function () {
    if (this.players.size < 2) {
      return undefined;
    }

    if (this.state !== Tournament.STATE.PREPARING) {
      return undefined;
    }

    // TODO actually start tournament
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

  KOTournament.OPTIONS = {};

  return KOTournament;
});
