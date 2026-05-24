import Listener from '../core/listener.js';

/**
 * Constructor
 */
class ClosedTournamentCollapseListener extends Listener {
  constructor(tournamentlistview) {
    const tournaments = tournamentlistview.model;
    super(tournaments.closedTournaments);
    this.tournaments = tournaments;
    this.tournamentlistview = tournamentlistview;
  }

  /**
   * The tournament has been closed. Collapse it.
   *
   * @param tournamentID
   *          the tournament id
   */
  collapse(tournamentID) {
    let tournamentView, boxView;
    tournamentView = this.tournamentlistview.getSubview(tournamentID);
    boxView = tournamentView.boxview;
    if (!boxView.$view.hasClass('collapsed')) {
      boxView.model.emit('toggle');
    }
  }

  /**
   * @param emitter
   *          this.model
   * @param event
   *          'insert'
   * @param data
   *          a data object
   */
  oninsert(emitter, event, data) {
    const listener = this;
    // Use a timeout to avoid runtime concurrency problems during pageload.
    window.setTimeout(function () {
      listener.collapse(data.object);
    }, 1);
  }
}

export default ClosedTournamentCollapseListener;