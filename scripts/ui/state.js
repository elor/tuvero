/**
 * Create a StateModel singleton
 *
 * Note to self: Avoid DOM manipulations at all costs!
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/statemodel', 'core/listener'], function (StateModel, Listener) {
  var State

  State = new StateModel()

  Listener.bind(State, 'error', function (emitter, event, message) {
    console.error(message)
  })

  return State
})
