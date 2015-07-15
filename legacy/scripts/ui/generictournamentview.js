/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './tournamentview'], function(extend, View,
    TournamentView) {
  /**
   * Constructor
   */
  function GenericTournamentView(tournament, $view) {
    var tournamentID;
    GenericTournamentView.superconstructor.call(this, undefined, $view);

    tournamentID = tournament && tournament.getID();

    this.tournament = tournament;
    if (tournament) {
      this.view = new TournamentView(tournament, $view);
    } else {
      this.view = new View();
    }
  }
  extend(GenericTournamentView, View);

  GenericTournamentView.prototype.destroy = function() {
    this.view.destroy();
    GenericTournamentView.superclass.destroy.call(this);
  }

  return GenericTournamentView;
});
