/**
 * ServerTournamentController
 *
 * @return ServerTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/listener',
    'ui/servertournamentloader'], function(extend, Controller, Listener,
    StateSaver, State, PlayerModel, TeamModel, ServerTournamentLoader) {
  /**
   * Constructor
   */
  function ServerTournamentController(view) {
    ServerTournamentController.superconstructor.call(this, view);

    this.view.$view.find('button.play').click(
        this.model.readRegistrations.bind(this.model));
    Listener.bind(this.model, 'ready', function() {
      ServerTournamentLoader.loadTournament(this.model);
    }, this);
  }
  extend(ServerTournamentController, Controller);

  return ServerTournamentController;
});
