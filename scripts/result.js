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
 * @returns the newly constructed Result object
 */
define(function () {
  var Result = function (team1, team2, points1, points2) {
    if (typeof (team1) === 'number') {
      team1 = [ team1 ];
    }
    if (typeof (team2) === 'number') {
      team2 = [ team2 ];
    }

    // copy the array using the map function
    // not really fast or elegant, but handy
    this.team1 = team1.map(function (value) {
      return value;
    });

    this.team2 = team2.map(function (value) {
      return value;
    });

    this.points1 = points1;
    this.points2 = points2;
  };

  /**
   * getTeam() returns the team array
   * 
   * @param number
   *          {Integer} team number (1 or 2)
   * @returns {[Integer]} list of player ids or undefined if invalid number
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
   * @returns {Integer} points of the given team or undefined if invalid team
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
   * getNetto() returns the difference between the team's points
   * 
   * @returns {Number} gained netto points for first team
   */
  Result.prototype.getNetto = function () {
    return this.points1 - this.points2;
  };

  return Result;
});
