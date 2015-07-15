/**
 * TournamentController
 *
 * @return TournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], function(extend, Controller) {
  /**
   * Constructor
   */
  function TournamentController(view) {
    var tournament;

    TournamentController.superconstructor.call(this, view);

    tournament = this.model;

    this.view.$view.find('button.runtournament').click(function() {
      tournament.run();
    });
  }
  extend(TournamentController, Controller);

  return TournamentController;
});
