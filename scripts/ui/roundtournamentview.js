import TournamentView from './tournamentview.js';

/**
 * Constructor
 *
 * @param model
 *          a RoundTournamentModel instance
 * @param $view
 *          a DOM element to fill
 */
class RoundTournamentView extends TournamentView {
  constructor(model, $view, tournaments) {
    super(model, $view, tournaments);
    this.subcontroller = undefined;
    const $notlastround = $view.find('.notlastround');
    this.updateButtonState = function () {
      if (model.isLastRound()) {
        $notlastround.remove();
      }
    };
    model.registerListener(this);
    this.updateRound();
    this.updateButtonState();
  }

  onupdate() {
    this.updateRound();
    this.updateButtonState();
  }
}

export default RoundTournamentView;