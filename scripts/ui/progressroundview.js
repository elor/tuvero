import View from '../core/view.js';

/**
 * Constructor
 *
 * @param round
 *          the index of the current round
 * @param $view
 *          the view
 */
class ProgressRoundView extends View {
  constructor(round, $view) {
    super(undefined, $view);
    this.round = round;
    this.$round = this.$view.find('.round');
    this.updateRound();
  }

  updateRound() {
    this.$round.text(this.round + 1);
  }

  onstate() {
    this.updateRound();
  }
}

export default ProgressRoundView;