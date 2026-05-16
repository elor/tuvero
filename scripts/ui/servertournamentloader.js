/**
 * ServerTournamentLoader
 *
 * @return ServerTournamentLoader
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import StateSaver from './statesaver.js';
import State from './state.js';
import PlayerModel from './playermodel.js';
import TeamModel from './teammodel.js';
/**
 * Constructor
 */
function ServerTournamentLoader() {
  ServerTournamentLoader.superconstructor.call(this);
}
ServerTournamentLoader.prototype.loadTournament = function (tournament) {
  // create new root RefLog with proper name
  StateSaver.createNewEmptyTree(tournament.name);
  // load state
  State.restore(tournament.statejson);
  // for good measure, set the serverlink again
  State.serverlink.set(tournament.id);
};
ServerTournamentLoader.loadTournament =
//
ServerTournamentLoader.prototype.loadTournament;
export default ServerTournamentLoader;