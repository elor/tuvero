/**
 * a list of teams with some accessor functions
 */
define(function () {
  var Team, teams;

  teams = [];

  Team = function (names) {
    this.names = names.slice();
    this.id = teams.length;
    teams.push(this);
  };

  return Team;
});
