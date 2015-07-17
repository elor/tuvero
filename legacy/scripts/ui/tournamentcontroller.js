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
   *
   * @param view
   *          a TournamentView instance
   */
  function TournamentController(view) {
    var tournament;

    TournamentController.superconstructor.call(this, view);

    tournament = this.model;

    this.$runbutton = this.view.$view.find('button.runtournament');

    this.$runbutton.click(function() {
      tournament.run();
    });
  }
  extend(TournamentController, Controller);

  return TournamentController;
});
