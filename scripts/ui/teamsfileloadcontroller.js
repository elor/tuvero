define(['tuvero', 'lib/extend', 'ui/fileloadcontroller', 'ui/toast', 'ui/strings',
  'ui/state', 'ui/playermodel', 'ui/teammodel', 'presets'
],
function (tuvero, extend, FileLoadController, Toast, Strings,
  State, PlayerModel, TeamModel, Presets) {
  function TeamsFileLoadController ($button) {
    TeamsFileLoadController.superconstructor.call(this, $button)
  }
  extend(TeamsFileLoadController, FileLoadController)

  TeamsFileLoadController.prototype.readFile = TeamsFileLoadController.load
  TeamsFileLoadController.prototype.unreadFile = function () {}

  TeamsFileLoadController.parseCSVString = tuvero.io.csv.read
  TeamsFileLoadController.parseDPVString = tuvero.io.dpv.import.csv

  function dpv2player (dpv) {
    var name, player

    name = (dpv.Vorname + ' ' + dpv.Name) || dpv.SpielerID || dpv.LizNr
    player = new PlayerModel(name)

    player.club = dpv.Verein
    player.license = dpv.LizNr
    player.firstname = dpv.Vorname
    player.lastname = dpv.Name

    return player
  }

  function dpv2team (dpv) {
    var team = new TeamModel(dpv.Spieler.map(dpv2player), dpv.Teamnummer)

    team.number = dpv.Teamnummer
    team.alias = dpv.Pseudonym
    team.club = dpv['Anmeldender Verein']
    team.rankingpoints = Number(dpv.RLpunkteTeam)

    return team
  }

  function teamsizeFromTeams (teams) {
    return Math.min.apply(undefined, teams.map(function (team) {
      return team.length
    }))
  }

  TeamsFileLoadController.guessCSVType = function (teams) {
    if (teams.length === 0) {
      return 'empty'
    }

    if (teams[0].every(function (field) {
      return ['No.', 'Name', 'Team', 'Spieler'].indexOf(field) !== -1
    })) {
      return 'tuvero_teams_export'
    }

    return 'pure_csv'
  }

  /**
     * Read teamsize from teams array
     *
     * @param {[[string]]} teams
     *          a 2d teams array
     * @returns {number} the team size, or 0 on failure.
     */
  TeamsFileLoadController.guessCSVTeamsize = function (teams) {
    var teamsizes, teamsize

    if (teams.length === 0) {
      return 0
    }

    teamsizes = teams.map(function (team) {
      return team.length
    })

    teamsize = teamsizes[0]

    if (teamsizes.some(function (size) {
      return size !== teamsize
    })) {
      return 0
    }

    return teamsize
  }

  /**
     * load the teams from a csv string and write them to State
     *
     * @param {string} input A (multiline) csv string
     * @returns {boolean} true on success, false otherwise
     */
  TeamsFileLoadController.load = function (input) {
    var teams, teamsize

    input = tuvero.io.utf8.latin2utf8(input)
    if (State.teams.length !== 0) {
      Toast.once(Strings.teamsnotempty)
      return false
    }

    teams = TeamsFileLoadController.loadDPV(input)
    if (!teams) {
      teams = TeamsFileLoadController.loadCSV(input)
    }

    if (!teams) {
      Toast.once(Strings.invalidfileformat)
      return false
    }

    teamsize = teamsizeFromTeams(teams)

    State.teamsize.set(teamsize)

    teams.forEach(function (team) {
      State.teams.push(team)
    })

    Toast.once(Strings.loaded)

    return true
  }

  TeamsFileLoadController.loadCSV = function (input) {
    var teams, type

    teams = TeamsFileLoadController.parseCSVString(input)

    type = TeamsFileLoadController.guessCSVType(teams)
    switch (type) {
      case 'tuvero_teams_export':
        return TeamsFileLoadController.loadTuveroTeamExport(teams)
      case 'pure_csv':
      case 'empty':
        return TeamsFileLoadController.loadPureCSV(teams)
      default:
        console.error('unknown csv type: ' + type)
        return TeamsFileLoadController.loadPureCSV(teams)
    }
  }

  TeamsFileLoadController.loadTuveroTeamExport = function (teams) {
    var teamsize, header, hasTeamNumber

    header = teams.shift()
    hasTeamNumber = header[0] === 'No.'
    teamsize = TeamsFileLoadController.guessCSVTeamsize(teams)

    if (hasTeamNumber) {
      teamsize -= 1
    }

    if (teamsize >= Presets.registration.minteamsize &&
        teamsize <= Presets.registration.maxteamsize) {
      // create TeamModels
      return teams.map(function (names) {
        var teamNumber, team

        if (hasTeamNumber) {
          teamNumber = names.shift()
        }
        var players = names.map(function (name) {
          return new PlayerModel(name)
        })

        team = new TeamModel(players)
        if (hasTeamNumber) {
          TeamModel.number = teamNumber
        }
        return team
      })
    } else {
      // TODO handle failure gracefully
    }

    return undefined
  }

  TeamsFileLoadController.loadPureCSV = function (teams) {
    var teamsize = TeamsFileLoadController.guessCSVTeamsize(teams)

    // validate team size
    if (teamsize >= Presets.registration.minteamsize &&
        teamsize <= Presets.registration.maxteamsize) {
      // create TeamModels
      return teams.map(function (names) {
        var players = names.map(function (name) {
          return new PlayerModel(name)
        })

        return new TeamModel(players)
      })
    } else {
      // TODO handle failure gracefully
    }

    return undefined
  }

  TeamsFileLoadController.loadDPV = function (input) {
    var teams

    try {
      teams = TeamsFileLoadController.parseDPVString(input)
      if (teams.length > 0) {
        return teams.map(dpv2team)
      }
    } catch (e) {}

    return undefined
  }

  return TeamsFileLoadController
})
