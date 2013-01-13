/**
 * Implementation of the swiss tournament system
 */
define([ 'map', 'finebuchholzranking', 'game' ], function (Map,
    Finebuchholzranking, Game) {
  var Swisstournament;

  Swisstournament = function () {
    this.players = new Map();
    this.ranking = new Finebuchholzranking();
    this.state = 0; // 0 always is the first state, regardless of its name
  };

  Swisstournament.state = {
    PREPARING : 0,
    RUNNING : 1,
    FINISHED : 2
  };

  Swisstournament.prototype.addPlayer = function (id) {
    if (this.state === Swisstournament.state.PREPARING) {
      this.players.insert(id);
      return this;
    }
  };

  Swisstournament.prototype.start = function () {
    if (this.state === Swisstournament.state.PREPARING) {
      this.state = Swisstournament.state.RUNNING;
      return this;
    }

    return undefined;
  };

  Swisstournament.prototype.end = function () {
    if (this.state === Swisstournament.state.RUNNING) {
      // TODO check for running games
      this.state = Swisstournament.state.FINISHED;
      return this.getRanking();
    }

    return undefined;
  };

  Swisstournament.prototype.finishGame = function (game, points) {
    if (this.state === Swisstournament.state.RUNNIG) {
      // TODO apply ranking

      return this;
    }
    return undefined;
  };

  Swisstournament.prototype.openGames = function () {
    // TODO return array of open games
    return [];
  };

  Swisstournament.prototype.getRanking = function () {
//    var res = this.ranking.get();

    // TODO magic

    return {
    // TODO return the actual ranking datastructure according to tournament.js
    };
  };

  return Swisstournament;
});
