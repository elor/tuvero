/**
 * ServerTournamentLoader
 *
 * @return ServerTournamentLoader
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import StateSaver from './statesaver.js'
import StateLoader from './stateloader.js'
import State from './state.js'
import TeamModel from './teammodel.js'
import PlayerModel from './playermodel.js'
import TimeMachine from '../timemachine/timemachine.js'
import Toast from './toast.js'

/**
 * Constructor
 */
class ServerTournamentLoader {
  /**
   * The newest local commit whose saved state is linked to this server
   * tournament, or undefined. Scans each tree's youngest commit — a
   * pure localStorage read, the active state is untouched.
   */
  static findLocalCommit (alias) {
    for (let index = 0; index < TimeMachine.roots.length; index += 1) {
      const root = TimeMachine.roots.get(index)
      const commit = root.getYoungestDescendant() || root
      const data = commit.load()
      if (data) {
        try {
          if (JSON.parse(data).serverlink === alias) {
            return commit
          }
        } catch (ignored) {
          // unreadable state: not a candidate
        }
      }
    }
    return undefined
  }

  // Called as a class method: ServerTournamentLoader.loadTournament(...)
  // -- see servertournamentcontroller.js. Without `static` the call
  // would resolve to undefined.
  static loadTournament (tournament) {
    // No accidental duplicates: when this server tournament already
    // lives here, open the local copy instead of forking a new tree.
    const existing = ServerTournamentLoader.findLocalCommit(tournament.alias)
    if (existing) {
      StateLoader.loadCommit(existing)
      Toast.once('Lokale Kopie geöffnet')
      return
    }
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
    // A tournament loaded from the server is visibly meant to live
    // online: keep it uploaded by default. The checkbox in the commit
    // box stays as the opt-out. (State.clear() still defaults local
    // tournaments to false.)
    State.tabOptions.autouploadState.set(true)
    // Persist the restored State (with serverlink) to TimeMachine.
    // createNewEmptyTree() committed an empty State *before* restore
    // ran; without this second save, reload reads the earlier commit
    // and the serverlink is lost.
    StateSaver.saveState()
  }
}

export default ServerTournamentLoader
