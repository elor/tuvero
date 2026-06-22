/**
 * ServerTournamentLoader
 *
 * @return ServerTournamentLoader
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import StateSaver from './statesaver.js'
import State from './state.js'
import TeamModel from './teammodel.js'
import PlayerModel from './playermodel.js'

/**
 * Constructor
 */
class ServerTournamentLoader {
  // Called as a class method: ServerTournamentLoader.loadTournament(...)
  // -- see servertournamentcontroller.js. Without `static` the call
  // would resolve to undefined.
  static loadTournament (tournament) {
    // create new root RefLog with proper name
    StateSaver.createNewEmptyTree(tournament.name)
    if (tournament.isSeed) {
      // No upload exists yet -- the server returned a seed envelope
      // with the metadata we already have plus any preregistered
      // teams. Pull teamsize across first, then feed the prereg list
      // into the same TeamModel/PlayerModel constructors the
      // "register teams" UI uses.
      if (tournament.statejson && tournament.statejson.teamsize) {
        State.teamsize.set(tournament.statejson.teamsize)
      }
      // Preselect the showTeamName tab option when the organiser
      // has opted into collecting team names. The server only ships
      // ``seed.name`` on each team when this flag is true, so the
      // tab option is the right place to wire it in.
      if (tournament.statejson && tournament.statejson.show_team_name) {
        State.tabOptions.showTeamName.set(true)
      }
      if (tournament.statejson && tournament.statejson.teams) {
        tournament.statejson.teams.forEach(function (seed) {
          const players = (seed.players || []).map(function (alias) {
            return new PlayerModel(alias)
          })
          const team = new TeamModel(players)
          if (seed.name) {
            team.setName(seed.name)
          }
          State.teams.push(team)
        })
      }
    } else if (tournament.statejson) {
      // Real state download -- restore from the inner body.
      State.restore(tournament.statejson)
    }
    // for good measure, set the serverlink again
    State.serverlink.set(tournament.alias)
    // Persist the restored State (with serverlink) to TimeMachine.
    // createNewEmptyTree() committed an empty State *before* restore
    // ran; without this second save, reload reads the earlier commit
    // and the serverlink is lost.
    StateSaver.saveState()
  }
}

export default ServerTournamentLoader
