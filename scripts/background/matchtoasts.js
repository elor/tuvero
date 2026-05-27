/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from '../ui/state.js'
import Toast from '../ui/toast.js'
import Strings from '../ui/strings.js'
import Listener from '../core/listener.js'
const MatchToasts = {}

/*
 * toast for finished matches
 */
MatchToasts.matchfinished = new Listener()
MatchToasts.matchfinished.onremove = function (emitter, event, data) {
  if (data.object.isRunningMatch()) {
    return new Toast(Strings.gamefinished)
  }
}

/*
 * toast for tournament state changes
 */
MatchToasts.tournamentState = new Listener()
MatchToasts.tournamentState.onupdate = function (emitter, event, data) {
  return new Toast(Strings['tournament_' + data], Toast.LONG)
}

/*
 * bind the listeners to all tournaments, and send a 'tournament created'
 * Toast
 */
Listener.bind(State.tournaments, 'insert', function (emitter, event, data) {
  data.object.getMatches().registerListener(MatchToasts.matchfinished)
  data.object.getState().registerListener(MatchToasts.tournamentState)
  return new Toast(Strings.tournament_initial, Toast.LONG)
})
Listener.bind(State.tournaments, 'remove', function (emitter, event, data) {
  data.object.getMatches().unregisterListener(MatchToasts.matchfinished)
  data.object.getState().unregisterListener(MatchToasts.tournamentState)
})
export default MatchToasts
