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
      this.teams[team].push(pid);
    }

    return this;
  };

  Game.prototype.start = function (time) {
    this.starttime = time || (new Date()).getTime();
  };
});
