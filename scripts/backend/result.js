/**
 * A Result represents the outcome of a game with two teams, usually including
 * one to three players.
 * 
 * @param team1
 *          Array of player ids of the first team. Creates an internal copy.
 * @param team2
 *          Array of player ids of the second team. Creates an internal copy.
 * @param points1
 *          {Integer} Points of the first team
 * @param points2
 *          {Integer} Points of the second team
 * @return the newly constructed Result object
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './game' ], function (Game) {
  var Result = function (team1, team2, points1, points2) {
    if (typeof (team1) === 'number') {
      team1 = [ team1 ];
    }
    if (typeof (team2) === 'number') {
      team2 = [ team2 ];
    }

    // copy the array using the slice function
    this.team1 = team1.slice();
    this.team2 = team2.slice();

    this.points1 = points1;
    this.points2 = points2;
  };

  /**
   * getTeam() returns the team array
   * 
   * @param number
   *          {Integer} team number (1 or 2)
   * @return {[Integer]} list of player ids or undefined if invalid number
   */
  Result.prototype.getTeam = function (number) {
    switch (number) {
    case 1:
      return this.team1;
    case 2:
      return this.team2;
    default:
      return undefined;
    }
  };

  /**
   * getPoints() returns the points for the given team
   * 
   * @param teamnumber
   *          {Integer} team number (1 or 2)
   * @return {Integer} points of the given team or undefined if invalid team
   *          number
   */
  Result.prototype.getPoints = function (teamnumber) {
    switch (teamnumber) {
    case 1:
      return this.points1;
    case 2:
      return this.points2;
    default:
      return undefined;
    }
  };

  /**
   * point setter
   * 
   * @param teamnumber
   *          1 or 2
   * @param points
   *          points
   * @return {Result} undefined on failure, this otherwise
   */
  Result.prototype.setPoints = function (teamnumber, points) {
    switch (teamnumber) {
    case 1:
      this.points1 = points;
      break;
    case 2:
      this.points2 = points;
      break;
    default:
      return undefined;
    }
    return this;
  };

  /**
   * getNetto() returns the difference between the team's points
   * 
   * @return {Number} gained netto points for first team
   */
  Result.prototype.getNetto = function () {
    return this.points1 - this.points2;
  };

  /**
   * copies this
   * 
   * @return the copy
   */
  Result.prototype.copy = function () {
    return new Result(this.team1, this.team2, this.points1, this.points2);
  };

  /**
   * Creates a Game instance from the teams
   * 
   * @return {Game} the game that lead to this result, excluding the correct
   *          start time.
   */
  Result.prototype.getGame = function () {
    var game = new Game();

    this.team1.forEach(function (pid) {
      game.add(0, pid);
    }, this);

    this.team2.forEach(function (pid) {
      game.add(1, pid);
    }, this);

    return game;
  };

  /**
   * creates an identical copy of a Result instance
   * 
   * @param res
   *          raw Result object, not necessarily with appropriate prototype and
   *          functions. Fields are sufficient.
   * @return the copy
   */
  Result.copy = function (res) {
    return new Result(res.team1, res.team2, res.points1, res.points2);
  };

  return Result;
});
