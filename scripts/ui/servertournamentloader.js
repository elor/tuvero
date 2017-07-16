/**
 * ServerTournamentLoader
 *
 * @return ServerTournamentLoader
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/statesaver', 'ui/state', 'ui/playermodel', 'ui/teammodel'], //
function(StateSaver, State, PlayerModel, TeamModel) {
  /**
   * Constructor
   */
  function ServerTournamentLoader() {
    ServerTournamentLoader.superconstructor.call(this);
  }

  ServerTournamentLoader.prototype.loadTournament = function(tournament) {
    // create new root RefLog with proper name
    StateSaver.createNewEmptyTree(tournament.name);
    // add all players
    State.teamsize.set(tournament.teamsize);
    State.serverlink.set(tournament.id);

    // TODO switch to teamstab

    tournament.registrations.forEach(function(names) {
      var players;

      while (names.length > State.teamsize.get()) {
        names.pop();
      }
      while (names.length < State.teamsize.get()) {
        names.push('N.N.');
      }

      players = names.map(function(name) {
        var player = new PlayerModel(name);

        if (player.getName() === PlayerModel.NONAME) {
          return undefined;
        }

        return player;
      });

      if (players.indexOf(undefined) === -1) {
        State.teams.push(new TeamModel(players));
      }
    }, this);
  };

  ServerTournamentLoader.loadTournament = //
  ServerTournamentLoader.prototype.loadTournament;

  return ServerTournamentLoader;
});
