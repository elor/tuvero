/**
 * ServerTournamentController
 *
 * @return ServerTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/listener',
    'ui/servertournamentloader'], function(extend, Controller, Listener,
    ServerTournamentLoader) {
  /**
   * Constructor
   */
  function ServerTournamentController(view) {
    ServerTournamentController.superconstructor.call(this, view);

    this.view.$view.find('button.play').click(
        this.model.downloadState.bind(this.model));
    Listener.bind(this.model, 'ready', function() {
      ServerTournamentLoader.loadTournament(this.model);
    }, this);
  }
  extend(ServerTournamentController, Controller);

  return ServerTournamentController;
});
