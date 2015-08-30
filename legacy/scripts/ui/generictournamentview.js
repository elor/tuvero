/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './tournamentview', './roundtournamentview',
    './swisstournamentview'], function(extend, View, TournamentView,
    RoundTournamentView, SwissTournamentView) {
  var constructors, defaultConstructor;

  constructors = {
    swiss: SwissTournamentView,
    round: RoundTournamentView
  };

  defaultConstructor = TournamentView;

  /**
   * Constructor
   */
  function GenericTournamentView(tournament, $view) {
    var Constructor;
    GenericTournamentView.superconstructor.call(this, undefined, $view);

    this.tournament = tournament;
    if (tournament) {
      Constructor = constructors[tournament.SYSTEM] || defaultConstructor;
      this.view = new Constructor(tournament, $view);
    } else {
      this.view = new View(undefined, $view);
    }
  }
  extend(GenericTournamentView, View);

  GenericTournamentView.prototype.destroy = function() {
    this.view.destroy();
    GenericTournamentView.superclass.destroy.call(this);
  };

  return GenericTournamentView;
});
