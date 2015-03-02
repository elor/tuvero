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
define(['./strings', './shared', './state_new', './playermodel',
    './teammodel'], function(Strings, Shared, State, PlayerModel,
    TeamModel) {
  var Team, teams;

  teams = State.teams;

  Team = {};

  /**
   * create a new team;
   *
   * @param names
   *          an array of the player names
   * @return this
   */
  Team.create = function(names) {
    var team, newplayers;

    newplayers = names.map(function(name) {
      return new PlayerModel(name);
    });

    team = new TeamModel(newplayers);
    teams.push(team);

    return team;
  };

  /**
   * get the team by its index
   *
   * @param index
   *          index (starting at zero!)
   * @return a reference to the registered team on success, undefined otherwise
   */
  Team.get = function(index) {
    return teams.get(index);
  };

  /**
   * erase team at index
   *
   * @param index
   *          index (starting at zero)
   * @return nothing at all
   */
  Team.erase = function(index) {
    teams.remove(index);
  };

  /**
   * returns the number of teams
   *
   * @return the number of teams
   */
  Team.count = function() {
    return teams.length;
  };

  /**
   * create ordered CSV strings from team data
   *
   * @return CSV file content
   */
  Team.toCSV = function() {
    var lines;

    if (Team.count() === 0) {
      return '';
    }

    lines = [Strings['teamhead' + State.teamsize.get()]];

    teams.asArray().forEach(
        function(team) {
          var line, i;

          line = [team.getID() + 1];

          for (i = 0; i < State.teamsize.get(); i += 1) {
            if (team.getPlayer(i).getName()) {
              line.push('"' + team.getPlayer(i).getName().replace(/"/g, '""')
                  + '"');
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
   * @return a serialization of the teams
   */
  Team.toBlob = function() {
    var list;

    list = teams.asArray().map(function(team, index) {
      return {
        names: Team.getNames(index),
        id: index
      };
    });

    return JSON.stringify(list);
  };

  /**
   * restores the state written by toBlob
   *
   * @param blob
   *          the blob
   */
  Team.fromBlob = function(blob) {
    var list;

    Team.reset();

    list = JSON.parse(blob);
    if (list) {
      list.map(function(team) {
        Team.create(team.names);
      });
    }
  };

  /**
   * resets the teams
   */
  Team.reset = function() {
    teams.clear();
  };

  /**
   * get an array of names of the players in a team
   *
   * @param id
   *          the id of the team
   * @return an array of names
   */
  Team.getNames = function(id) {
    var team, index, names;

    team = teams.get(id);
    if (team) {
      names = [];
      for (index = 0; index < team.length; index += 1) {
        names.push(team.getPlayer(index).getName());
      }

      return names;
    }

    return undefined;
  };

  Shared.Team = Team;
  return Team;
});
