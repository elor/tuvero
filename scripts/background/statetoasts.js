/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state', 'core/listener', 'ui/toast', 'ui/strings'], function (
  State, Listener, Toast, Strings) {
  var StateToasts

  StateToasts = {}

  /*
   * show error toasts
   */
  StateToasts.errorListener = Listener.bind(State, 'error', function (emitter,
    event, message) {
    Toast.once(message, Toast.LONG)
  })

  StateToasts.clearListener = Listener.bind(State, 'clear', function (emitter,
    event, message) {
    // TODO replace with Toast.isInitialized or similar.
    if (Toast.$container !== undefined) {
      Toast.once(Strings.newtournament, Toast.LONG)
    }
  })

  return StateToasts
})
