/**
 * RoundTournamentView
 *
 * @return RoundTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/tournamentview'], function (extend, TournamentView) {
  /**
   * Constructor
   *
   * @param model
   *          a RoundTournamentModel instance
   * @param $view
   *          a DOM element to fill
   */
  function RoundTournamentView (model, $view, tournaments) {
    RoundTournamentView.superconstructor.call(this, model, $view, tournaments)

    this.subcontroller = undefined

    var $notlastround = $view.find('.notlastround')

    this.updateButtonState = function () {
      if (model.isLastRound()) {
        $notlastround.remove()
      }
    }

    model.registerListener(this)

    this.updateRound()
    this.updateButtonState()
  }
  extend(RoundTournamentView, TournamentView)

  RoundTournamentView.prototype.onupdate = function () {
    this.updateRound()
    this.updateButtonState()
  }

  return RoundTournamentView
})
