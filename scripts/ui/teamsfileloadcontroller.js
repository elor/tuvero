define(["tuvero", "lib/extend", "ui/fileloadcontroller", "ui/toast", "ui/strings",
    "ui/state", "ui/playermodel", "ui/teammodel", "presets"
  ],
  function (tuvero, extend, FileLoadController, Toast, Strings,
    State, PlayerModel, TeamModel, Presets) {

    function TeamsFileLoadController($button) {
      TeamsFileLoadController.superconstructor.call(this, $button);
    }
    extend(TeamsFileLoadController, FileLoadController);

    TeamsFileLoadController.prototype.readFile = TeamsFileLoadController.load;
    TeamsFileLoadController.prototype.unreadFile = function () {};

    TeamsFileLoadController.parseCSVString = tuvero.io.csv.read;

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
      if (teamsize >= Presets.registration.minteamsize &&
        teamsize <= Presets.registration.maxteamsize) {
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