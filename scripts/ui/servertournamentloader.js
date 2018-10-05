/**
 * ServerTournamentLoader
 *
 * @return ServerTournamentLoader
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["ui/statesaver", "ui/state", "ui/playermodel", "ui/teammodel"], //
function (StateSaver, State, PlayerModel, TeamModel) {
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

  ServerTournamentLoader.loadTournament = //
  ServerTournamentLoader.prototype.loadTournament;

  return ServerTournamentLoader;
});
