/**
 * a list of teams with some accessor functions
 */
define([ './options', './strings' ], function (Options, Strings) {
  var Team, teams;

  teams = [];

  Team = {};

  /**
   * create a new team;
   */
  Team.create = function (names) {
    var team;

    team = {};

    // copy the names array
    team.names = names.slice();
    team.id = teams.length;

    teams.push(team);

    return team;
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
  Team.prepareTournament = function (Tournament) {
    teams.forEach(function (team, index) {
      Tournament.addPlayer(index);
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

  /**
   * create ordered CSV strings from team data
   * 
   * @returns CSV file content
   */
  Team.toCSV = function () {
    var lines, i;

    lines = [ Strings['teamhead' + Options.teamsize] ];

    teams.forEach(function (team) {
      var line, i;

      line = [ team.id + 1 ];

      for (i = 0; i < Options.teamsize; i += 1) {
        if (team.names[i]) {
          line.push('"' + team.names[i].replace(/"/g, '""') + '"');
        } else {
          line.push('"%% %%"');
        }
      }

      lines.push(line.join(','));
    });

    return lines.join('\r\n');
  };

  /**
   * stores the current state in a blob, usually using JSON
   * 
   * @returns the blob
   */
  Team.toBlob = function () {
    return JSON.stringify(teams);
  };

  /**
   * restores the state written by toBlob
   * 
   * @param blob
   *          the blob
   */
  Team.fromBlob = function (blob) {
    teams = JSON.parse(blob);
  };

  /**
   * resets the teams
   */
  Team.reset = function () {
    teams = [];
  };

  return Team;
});
