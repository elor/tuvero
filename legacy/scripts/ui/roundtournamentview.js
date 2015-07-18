/**
 * RoundTournamentView
 *
 * @return RoundTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentview'], function(extend, TournamentView) {
  /**
   * Constructor
   *
   * @param model
   *          a RoundTournamentModel instance
   * @param $view
   *          a DOM element to fill
   */
  function RoundTournamentView(model, $view) {
    RoundTournamentView.superconstructor.call(this, model, $view);

    this.subcontroller = undefined;

    this.updateRound();
  }
  extend(RoundTournamentView, TournamentView);

  return RoundTournamentView;
});
