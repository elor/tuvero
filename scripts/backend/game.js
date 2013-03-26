/**
 * Game is an object which represents a running game, thereby storing the teams
 * and the time at which the game started.
 */
define(function () {
  /**
   * constructor of a Game instance. It simply initiates both variables
   */
  var Game = function (p1, p2) {
    this.teams = []; // team array
    this.starttime = 0; // start time in unix epoch milliseconds

    // default behaviour: two teams, one player per team (tournaments are
    // expected to treat teams as players)
    if (p1 !== undefined && p2 !== undefined && typeof p1 === 'number'
        && typeof p2 === 'number') {
      this.add(0, p1);
      this.add(1, p2);
    }
  };

  /**
   * add a team member
   * 
   * @param team
   *          id of the team, starting with 0
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

  /**
   * set the start time to the given argument or the current time
   * 
   * @param time
   *          (optional) the time to set to. If undefined, the current time is
   *          used.
   */
  Game.prototype.start = function (time) {
    this.starttime = time || (new Date()).getTime();
  };

  /**
   * deep equal test of this and another game
   * 
   * @param game
   *          another game
   * @returns {Boolean} true if the games are equivalent (save for starttime),
   *          false otherwise
   */
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

      if (t1 === undefined || t2 === undefined || t1.length !== t2.length
          || t1.length === 0) {
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

  /**
   * create a deep copy of the game, including the starttime
   * 
   * @returns copy
   */
  Game.prototype.copy = function () {
    var ret;

    ret = new Game();

    this.teams.forEach(function (team, tid) {
      team.forEach(function (pid) {
        ret.add(tid, pid);
      }, this);
    }, this);

    ret.starttime = this.starttime;

    return ret;
  };

  return Game;
});
