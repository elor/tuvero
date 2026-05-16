/**
 * Create a StateModel singleton
 *
 * Note to self: Avoid DOM manipulations at all costs!
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import StateModel from './statemodel.js';
import Listener from '../core/listener.js';
var State;
State = new StateModel();
Listener.bind(State, 'error', function (emitter, event, message) {
  console.error(message);
});
export default State;