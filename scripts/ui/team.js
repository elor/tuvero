/**
 * a list of teams with some accessor functions
 */
define([ './swiss' ], function (Swiss) {
  var Team, teams;

  teams = [];

  Team = function (names) {
    this.names = names.slice();
    this.id = teams.length;
    teams.push(this);
  };

  /**
   * get the team by its index
   * 
   * @param index
   *          index (starting at zero!)
   * @returns a reference to the registered team on success, undefined otherwise
   */
  Team.get = function (index) {
    return teams[index];
  };

  /**
   * adds all players to the tournament
   */
  Team.prepareTournament = function () {
    teams.forEach(function (team, index) {
      Swiss.addPlayer(index);
    });
  };

  /**
   * returns the number of teams
   * 
   * @returns the number of teams
   */
  Team.count = function () {
    return teams.length;
  };

  Team.serialize = function () {
    return JSON.stringify(teams);
  };

  Team.deserialize = function (string) {
    teams = JSON.parse(string);
  };

  return Team;
});
