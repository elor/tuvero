/**
 * ClosedTournamentCollapseListener
 *
 * @return ClosedTournamentCollapseListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener'], function(extend, Listener) {
  /**
   * Constructor
   */
  function ClosedTournamentCollapseListener(tournamentlistview) {
    var tournaments = tournamentlistview.model;
    ClosedTournamentCollapseListener.superconstructor.call(this,
        tournaments.closedTournaments);

    this.tournaments = tournaments;
    this.tournamentlistview = tournamentlistview;
  }
  extend(ClosedTournamentCollapseListener, Listener);

  /**
   * The tournament has been closed. Collapse it.
   *
   * @param tournamentID
   *          the tournament id
   */
  ClosedTournamentCollapseListener.prototype.collapse = function(tournamentID) {
    var tournamentView, boxView;

    tournamentView = this.tournamentlistview.getSubview(tournamentID);
    boxView = tournamentView.boxview;
    if (!boxView.$view.hasClass('collapsed')) {
      boxView.model.emit('toggle');
    }
  };

  /**
   * @param emitter
   *          this.model
   * @param event
   *          'insert'
   * @param data
   *          a data object
   */
  ClosedTournamentCollapseListener.prototype.oninsert = function(emitter,
      event, data) {
    var listener = this;
    // Use a timeout to avoid runtime concurrency problems during pageload.
    window.setTimeout(function() {
      listener.collapse(data.object);
    }, 1);
  };

  return ClosedTournamentCollapseListener;
});
