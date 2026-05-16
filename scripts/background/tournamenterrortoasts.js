/**
 * Display tournament-related errors as Toasts
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from '../ui/state.js';
import ListCollectorModel from '../ui/listcollectormodel.js';
import TournamentModel from '../tournament/tournamentmodel.js';
import Toast from '../ui/toast.js';
import Strings from '../ui/strings.js';
var TournamentErrorToasts;

// save on player name change
TournamentErrorToasts = new ListCollectorModel(State.tournaments, TournamentModel);
TournamentErrorToasts.onerror = function (emitter, event, message) {
  return new Toast(Strings.tournamenterrorprefix + ': ' + message,
  //
  Toast.LONG);
};
export default TournamentErrorToasts;