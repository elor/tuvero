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
  function GenericTournamentView(index, $view, tournaments) {
    GenericTournamentView.superconstructor.call(this, undefined, $view);

    this.$view.append($('<h3>').text("Tournament " + index));
    this.$view.append($('<h3>').text("Tournament " + index));

    if (index === undefined) {
      // TODO show generic tournament starter stuff
    } else {
      this.tournament = tournaments.get(index);

      this.view = new TournamentView(tournament, $view);
    }
  }
  extend(GenericTournamentView, View);

  return GenericTournamentView;
});
