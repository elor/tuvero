/**
 * ServerTournamentController
 *
 * @return ServerTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/listener', 'ui/statesaver',
    'ui/state', 'ui/playermodel', 'ui/teammodel'], function(extend, Controller,
    Listener, StateSaver, State, PlayerModel, TeamModel) {
  /**
   * Constructor
   */
  function ServerTournamentController(view) {
    ServerTournamentController.superconstructor.call(this, view);

    this.view.$view.find('button.play').click(
        this.model.readRegistration.bind(this.model));
    Listener.bind(this.model, 'ready', this.createTournament, this);
  }
  extend(ServerTournamentController, Controller);

  ServerTournamentController.prototype.createTournament = function() {
    // create new root RefLog with proper name
    StateSaver.createNewEmptyTree(this.model.name);
    // add all players
    State.teamsize.set(this.model.teamsize);
    // TODO switch to teamstab
    this.registrations.forEach(function(names) {
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

  return ServerTournamentController;
});
