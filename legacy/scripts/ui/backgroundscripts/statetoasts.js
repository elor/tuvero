/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['../state_new', 'core/listener', '../toast', '../strings'], function(
    State, Listener, Toast, Strings) {
  var StateToasts;

  StateToasts = {};

  /*
   * show error toasts
   */
  StateToasts.errorListener = Listener.bind(State, 'error', function(emitter,
      event, message) {
    new Toast(message, Toast.LONG);
  });

  StateToasts.clearListener = Listener.bind(State, 'clear', function(emitter,
      event, message) {
    // TODO replace with Toast.isInitialized or similar.
    if (Toast.$container !== undefined) {
      new Toast(Strings.newtournament, Toast.LONG);
    }
  });

  return StateToasts;
});
