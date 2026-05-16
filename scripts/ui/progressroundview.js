/**
 * ProgressRoundView
 *
 * @return ProgressRoundView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
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
ProgressRoundView.prototype.updateRound = function () {
  this.$round.text(this.round + 1);
};
ProgressRoundView.prototype.onstate = function () {
  this.updateRound();
};
export default ProgressRoundView;