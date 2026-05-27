/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from '../ui/state.js'
import Listener from '../core/listener.js'
import Toast from '../ui/toast.js'
import Strings from '../ui/strings.js'
let StateToasts
StateToasts = {}

/*
 * show error toasts
 */
StateToasts.errorListener = Listener.bind(State, 'error', function (emitter, event, message) {
  Toast.once(message, Toast.LONG)
})
StateToasts.clearListener = Listener.bind(State, 'clear', function (emitter, event, message) {
  // TODO replace with Toast.isInitialized or similar.
  if (Toast.$container !== undefined) {
    Toast.once(Strings.newtournament, Toast.LONG)
  }
})
export default StateToasts
