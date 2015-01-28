/**
 * Create a StateModel singleton
 * 
 * Note to self: Avoid DOM manipulations at all costs!
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './statemodel' ], function (StateModel) {
  var State;

  State = new StateModel();

  return State;
});
