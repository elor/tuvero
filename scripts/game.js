/**
 * Game is an object which represents a running game, thereby storing the teams
 * and the time at which the game started.
 */
define(function () {
  /**
   * constructor of a Game instance. It simply initiates both variables
   */
  var Game = function () {
    this.teams = []; // team array
    this.starttime = 0; // start time in unix epoch milliseconds
  };

  /**
   * add a team member
   * 
   * @param team
   *          id of the team
   * @param pid
   *          player id
   * @returns this
   */
  Game.prototype.add = function (team, pid) {
    if (typeof team !== 'number' || typeof pid !== 'number') {
      return undefined;
    }

    if (this.teams[team] === undefined) {
      this.teams[team] = [ pid ];
    } else {
      if (this.teams[team].indexOf(pid) === -1) {
        this.teams[team].push(pid);
      }
    }

    return this;
  };

  Game.prototype.start = function (time) {
    this.starttime = time || (new Date()).getTime();
  };

  Game.prototype.equals = function (game) {
    var i, j, t1, t2;

    if (game === undefined || game.prototype !== this.prototype) {
      return false;
    }

    if (this.teams.length !== game.teams.length && this.teams.length !== 0) {
      return false;
    }

    for (i = 0; i < this.teams.length; i += 1) {
      t1 = this.teams[i];
      t2 = game.teams[i];

      if (t1 && t2 && t1.length === t2.length && t1.length !== 0) {
        return false;
      }

      for (j = 0; j < t1.length; j += 1) {
        if (t2.indexOf(t1[j]) === -1) {
          return false;
        }
      }
    }

    return true;
  };
});
