import { io } from 'tuvero'
import FileLoadController from './fileloadcontroller.js'
import Toast from './toast.js'
import Strings from './strings.js'
import State from './state.js'
import PlayerModel from './playermodel.js'
import TeamModel from './teammodel.js'
import Presets from 'presets'

class TeamsFileLoadController extends FileLoadController {
  unreadFile () {}

  static guessCSVType (teams) {
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
  static guessCSVTeamsize (teams) {
    if (teams.length === 0) {
      return 0
    }
    const teamsizes = teams.map(function (team) {
      return team.length
    })
    const teamsize = teamsizes[0]
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
  static load (input) {
    input = io.utf8.latin2utf8(input)
    if (State.teams.length !== 0) {
      Toast.once(Strings.teamsnotempty)
      return false
    }
    let teams = TeamsFileLoadController.loadDPV(input)
    if (!teams) {
      teams = TeamsFileLoadController.loadCSV(input)
    }
    if (!teams) {
      Toast.once(Strings.invalidfileformat)
      return false
    }
    const teamsize = teamsizeFromTeams(teams)
    State.teamsize.set(teamsize)
    teams.forEach(function (team) {
      State.teams.push(team)
    })
    Toast.once(Strings.loaded)
    return true
  }

  static loadCSV (input) {
    const teams = TeamsFileLoadController.parseCSVString(input)
    const type = TeamsFileLoadController.guessCSVType(teams)
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

  static loadTuveroTeamExport (teams) {
    const header = teams.shift()
    const hasTeamNumber = header[0] === 'No.'
    let teamsize = TeamsFileLoadController.guessCSVTeamsize(teams)
    if (hasTeamNumber) {
      teamsize -= 1
    }
    if (teamsize >= Presets.registration.minteamsize && teamsize <= Presets.registration.maxteamsize) {
      // create TeamModels
      return teams.map(function (names) {
        let teamNumber
        if (hasTeamNumber) {
          teamNumber = names.shift()
        }
        const players = names.map(function (name) {
          return new PlayerModel(name)
        })
        const team = new TeamModel(players)
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

  static loadPureCSV (teams) {
    const teamsize = TeamsFileLoadController.guessCSVTeamsize(teams)

    // validate team size
    if (teamsize >= Presets.registration.minteamsize && teamsize <= Presets.registration.maxteamsize) {
      // create TeamModels
      return teams.map(function (names) {
        const players = names.map(function (name) {
          return new PlayerModel(name)
        })
        return new TeamModel(players)
      })
    } else {
      // TODO handle failure gracefully
    }
    return undefined
  }

  static loadDPV (input) {
    try {
      const teams = TeamsFileLoadController.parseDPVString(input)
      if (teams.length > 0) {
        return teams.map(dpv2team)
      }
    } catch (e) {}
    return undefined
  }

  static parseCSVString = io.csv.read
  static parseDPVString = io.dpv.import.csv
}

TeamsFileLoadController.prototype.readFile = TeamsFileLoadController.load
function dpv2player (dpv) {
  const name = dpv.Vorname + ' ' + dpv.Name || dpv.SpielerID || dpv.LizNr
  const player = new PlayerModel(name)
  player.club = dpv.Verein
  player.license = dpv.LizNr
  player.firstname = dpv.Vorname
  player.lastname = dpv.Name
  return player
}
function dpv2team (dpv) {
  const team = new TeamModel(dpv.Spieler.map(dpv2player), dpv.Teamnummer)
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
export default TeamsFileLoadController
