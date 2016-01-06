/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['../state_new', '../listcollectormodel', 'core/tournamentmodel',
    '../toast', '../strings'], function(State, ListCollectorModel,
    TournamentModel, Toast, Strings) {
  var TournamentErrorToasts;

  // save on player name change
  TournamentErrorToasts = new ListCollectorModel(State.tournaments,
      TournamentModel);
  /**
   * overwrite the update listener: save whenever a team has been updated.
   *
   * Note to self: this also catches setID-fired events. Storage.store should
   * buffer multiple store() requests anyhow
   */
  TournamentErrorToasts.onerror = function(emitter, event, message) {
    return new Toast(Strings.tournamenterrorprefix + ': ' + message,//
    Toast.LONG);
  };

  return TournamentErrorToasts;
});
