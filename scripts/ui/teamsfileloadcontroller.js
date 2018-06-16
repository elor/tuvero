define(["tuvero", "lib/extend", "ui/fileloadcontroller", "ui/toast", "ui/strings",
    "ui/state", "ui/playermodel", "ui/teammodel", "presets"
  ],
  function (tuvero, extend, FileLoadController, Toast, Strings,
    State, PlayerModel, TeamModel, Presets) {

    console.log(tuvero);

    function TeamsFileLoadController($button) {
      TeamsFileLoadController.superconstructor.call(this, $button);
    }
    extend(TeamsFileLoadController, FileLoadController);

    TeamsFileLoadController.prototype.readFile = TeamsFileLoadController.load;
    TeamsFileLoadController.prototype.unreadFile = function () {};

    TeamsFileLoadController.parseCSVString = tuvero.io.csv.read;
    TeamsFileLoadController.parseDPVString = tuvero.io.dpv.import.csv;

    function dpv2player(dpv) {
      var name, player;

      name = (dpv.Vorname + " " + dpv.Name) || dpv.SpielerID;
      player = new PlayerModel(name);

      player.club = dpv.Verein;
      player.license = dpv.LizNr;
      player.firstname = dpv.Vorname;
      player.lastname = dpv.Name;

      return player;
    }

    function dpv2team(dpv) {
      var team = new TeamModel(dpv.Spieler.map(dpv2player), dpv.Teamnummer);

      team.number = dpv.Teamnummer;
      team.alias = dpv.Pseudonym;
      team.club = dpv["Anmeldender Verein"];
      team.rankingpoints = Number(dpv.RLpunkteTeam);

      return team;
    }

    function teamsizeFromTeams(teams) {
      return Math.min.apply(undefined, teams.map(function (team) {
        return team.length;
      }));
    }

    /**
     * Read teamsize from teams array
     *
     * @param {[[string]]} teams
     *          a 2d teams array
     * @returns {number} the team size, or 0 on failure.
     */
    TeamsFileLoadController.guessCSVTeamsize = function (teams) {
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
     * @param {string} input A (multiline) csv string
     * @returns {boolean} true on success, false otherwise
     */
    TeamsFileLoadController.load = function (input) {
      var teams, teamsize;

      input = tuvero.io.utf8.latin2utf8(input);
      if (State.teams.length !== 0) {
        new Toast(Strings.teamsnotempty);
        return false;
      }

      teams = TeamsFileLoadController.loadDPV(input);
      if (!teams) {
        teams = TeamsFileLoadController.loadCSV(input);
      }

      if (!teams) {
        new Toast(Strings.invalidfileformat);
        return false;
      }

      teamsize = teamsizeFromTeams(teams);

      State.teamsize.set(teamsize);

      teams.forEach(function (team) {
        State.teams.push(team);
      });

      new Toast(Strings.loaded);

      return true;
    };

    TeamsFileLoadController.loadCSV = function (input) {
      var teams, teamsize;

      teams = TeamsFileLoadController.parseCSVString(input);
      teamsize = TeamsFileLoadController.guessCSVTeamsize(teams);

      // validate team size
      if (teamsize >= Presets.registration.minteamsize &&
        teamsize <= Presets.registration.maxteamsize) {

        // create TeamModels
        return teams.map(function (names) {
          var players = names.map(function (name) {
            return new PlayerModel(name);
          });

          return new TeamModel(players);
        });
      }

      return undefined;
    };

    TeamsFileLoadController.loadDPV = function (input) {
      var teams;

      try {
        teams = TeamsFileLoadController.parseDPVString(input);
        if (teams.length > 0) {
          return teams.map(dpv2team);
        }
      } catch (e) {}

      return undefined;
    };

    return TeamsFileLoadController;
  });