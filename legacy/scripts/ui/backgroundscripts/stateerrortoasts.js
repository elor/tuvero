/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['../state_new', 'core/listener', '../toast', '../strings'], function(
    State, Listener, Toast, Strings) {
  /*
   * show error toasts
   */
  Listener.bind(State, 'error', function(emitter, event, message) {
    new Toast(message, Toast.LONG);
  });
});
