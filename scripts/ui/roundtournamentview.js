/**
 * RoundTournamentView
 *
 * @return RoundTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ui/tournamentview"], function (extend, TournamentView) {
  /**
   * Constructor
   *
   * @param model
   *          a RoundTournamentModel instance
   * @param $view
   *          a DOM element to fill
   */
  function RoundTournamentView(model, $view, tournaments) {
    RoundTournamentView.superconstructor.call(this, model, $view, tournaments);

    this.subcontroller = undefined;

    this.updateRound();
  }
  extend(RoundTournamentView, TournamentView);

  return RoundTournamentView;
});
