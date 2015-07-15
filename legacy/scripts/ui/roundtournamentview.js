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

    this.$round = this.$view.find('.round');
    this.$nextround = this.$view.find('.nextround');

    this.updateRound();
  }
  extend(RoundTournamentView, TournamentView);

  RoundTournamentView.prototype.updateRound = function() {
    this.$round.text(this.model.getRound() + 1);
    this.$nextround.text(this.model.getRound() + 2);
  };

  RoundTournamentView.prototype.onstate = function() {
    this.updateRound();
  };

  return RoundTournamentView;
});
