/**
 * ProgressRoundView
 *
 * @return ProgressRoundView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View, StateClassView) {
  /**
   * Constructor
   *
   * @param round
   *          the index of the current round
   * @param $view
   *          the view
   */
  function ProgressRoundView(round, $view) {
    ProgressRoundView.superconstructor.call(this, undefined, $view);

    this.round = round;
    this.$round = this.$view.find('.round');

    this.updateRound();
  }
  extend(ProgressRoundView, View);

  ProgressRoundView.prototype.updateRound = function() {
    this.$round.text(this.round + 1);
  };

  ProgressRoundView.prototype.onstate = function() {
    this.updateRound();
  };

  return ProgressRoundView;
});
