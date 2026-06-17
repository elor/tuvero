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
      // No upload exists yet -- the server returned a seed
      // envelope with the metadata we already have. Start from a
      // fresh, empty tree; just pull teamsize across so the local
      // state matches what the organizer set up online.
      if (tournament.statejson && tournament.statejson.teamsize) {
        State.teamsize.set(tournament.statejson.teamsize)
      }
    } else if (tournament.statejson) {
      // Real state download -- restore from the inner body.
      State.restore(tournament.statejson)
    }
    // for good measure, set the serverlink again
    State.serverlink.set(tournament.alias)
  }
}

export default ServerTournamentLoader
