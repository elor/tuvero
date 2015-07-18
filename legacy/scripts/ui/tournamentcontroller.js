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
    var tournament, rankingOrder;

    TournamentController.superconstructor.call(this, view);

    tournament = this.model.tournament;
    rankingOrder = this.model.rankingOrder;

    this.$runbutton = this.view.$view.find('button.runtournament');

    this.$runbutton.click(function() {
      if (tournament.getState().get() === 'initial') {
        if (rankingOrder.length < 1) {
          tournament.emit('error', 'not enough ranking components');
          return;
        }
        if (!tournament.setRankingOrder(rankingOrder.asArray())) {
          return;
        }
      }
      tournament.run();
    });
  }
  extend(TournamentController, Controller);

  return TournamentController;
});
