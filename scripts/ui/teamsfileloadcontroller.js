/**
 * TeamsFileLoadController: loads a whole file and adds its lines as teams
 *
 * Inner workings: An HTML5 FileReader reads all contents as ANSI (ISO-8859-1).
 * It then converts possible UTF-8 byte into utf-8 code points, leaving all
 * other characters in place. This enables the use of both latin-1 and utf-8 as
 * input file encoding.
 *
 * All other encodings are discouraged. DOS-style line endings are filtered by
 * "new TeamModel()". MAC-style line endings can still be a problem.
 *
 * TODO rewrite the whole thing and extract a lot of methods
 *
 * @return TeamsFileLoadController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["tuvero", "lib/extend", "ui/fileloadcontroller", "ui/toast", "ui/strings",
    "ui/state", "ui/playermodel", "ui/teammodel", "presets"],
    function (tuvero, extend, FileLoadController, Toast, Strings,
    State, PlayerModel, TeamModel, Presets) {

  /**
   * Constructor
   *
   * @param {$element} $button
   *          Optional. A button element which, when clicked, starts the file
   *          selection
   * @returns {undefined}
   */
  function TeamsFileLoadController($button) {
    TeamsFileLoadController.superconstructor.call(this, $button);
  }
  extend(TeamsFileLoadController, FileLoadController);

  /**
   * Implemented function: file read success. Start parsing.
   *
   * @param {string} fileContents
   *          file contents
   * @returns {boolean} true on success, false otherwise
   */
  TeamsFileLoadController.prototype.readFile = function (fileContents) {
    return TeamsFileLoadController.load(fileContents);
  };

  /**
   * Implemented function: unread current file. Nothing to do here, since there
   * should be no registered teams
   *
   * @returns {undefined}
   */
  TeamsFileLoadController.prototype.unreadFile = function () {
    // Nothing to unread
  };

  /**
   * reads names from a string and adds the players accordingly. Ignores
   * #-escaped lines
   *
   * @param {string} str A (multiline) CSV string
   * @returns {boolean} true on success, undefined or false on failure
   */
  TeamsFileLoadController.parseCSVString = function (str) {
    return tuvero.io.csv.read(str);
  };

  /**
   * Read teamsize from teams array
   *
   * @param {[[string]]} teams
   *          a 2d teams array
   * @returns {number} the team size, or 0 on failure.
   */
  TeamsFileLoadController.readTeamsize = function (teams) {
    var teamsizes, teamsize;

    if (teams.length === 0) {
      return 0;
    }

    teamsizes = teams.map(function (team) {
      return team.length;
    });

    teamsize = teamsizes[0];

    if (teamsizes.some(function (size) {
      return size !== teamsize;
    })) {
      return 0;
    }

    return teamsize;
  };

  /**
   * load the teams from a csv string and write them to State
   *
   * @param {string} csvString A (multiline) csv string
   * @returns {boolean} true on success, false otherwise
   */
  TeamsFileLoadController.load = function (csvString) {
    var teams, teamsize;

    csvString = tuvero.io.utf8.latin2utf8(csvString);

    if (State.teams.length !== 0) {
      new Toast(Strings.teamsnotempty);
      return false;
    }

    teams = TeamsFileLoadController.parseCSVString(csvString, State.teamsize);
    teamsize = TeamsFileLoadController.readTeamsize(teams);

    // validate team size
    if (teamsize >= Presets.registration.minteamsize
        && teamsize <= Presets.registration.maxteamsize) {
      State.teamsize.set(teamsize);
    } else {
      new Toast(Strings.invalidteamsize);
      return false;
    }

    // enter new teams
    teams.forEach(function (names) {
      var players = names.map(function (name) {
        return new PlayerModel(name);
      });

      State.teams.push(new TeamModel(players));
    });

    new Toast(Strings.loaded);

    return true;
  };

  return TeamsFileLoadController;
});
