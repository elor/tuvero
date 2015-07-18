/**
 * Managed list of registered teams
 *
 * @return Team
 * @implements ./csver
 * @implements ../backend/blobber
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./strings', './state_new'], function(Strings, State) {
  var Team;

  Team = {};
  /**
   * create ordered CSV strings from team data
   *
   * @return CSV file content
   */
  Team.toCSV = function() {
    var lines;

    if (State.teams.length === 0) {
      return '';
    }

    lines = [Strings['teamhead' + State.teamsize.get()]];

    State.teams.map(function(team) {
      var line, i;

      line = [team.getID() + 1];

      for (i = 0; i < State.teamsize.get(); i += 1) {
        if (team.getPlayer(i).getName()) {
          line.push('"' + team.getPlayer(i).getName().replace(/"/g, '""')//
              + '"');
        } else {
          line.push('"%% %%"');
        }
      }

      lines.push(line.join(','));
    });

    return lines.join('\r\n');
  };

  return Team;
});
