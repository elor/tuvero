/**
 * GenericTournamentView
 *
 * @return GenericTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', 'ui/tournamentview', 'ui/roundtournamentview',
  'ui/swisstournamentview', 'ui/kotournamentview', 'ui/placementtournamentview',
  'ui/poulestournamentview'],
function (extend, View, TournamentView, RoundTournamentView, SwissTournamentView,
  KOTournamentView, PlacementTournamentView, PoulesTournamentView) {
  var constructors, defaultConstructor

  constructors = {
    swiss: SwissTournamentView,
    round: RoundTournamentView,
    ko: KOTournamentView,
    placement: PlacementTournamentView,
    poules: PoulesTournamentView
  }

  defaultConstructor = TournamentView

  /**
     * Constructor
     */
  function GenericTournamentView (tournament, $view, tournaments) {
    var Constructor
    GenericTournamentView.superconstructor.call(this, undefined, $view)

    this.tournament = tournament
    if (tournament) {
      Constructor = constructors[tournament.SYSTEM] || defaultConstructor
      this.view = new Constructor(tournament, $view, tournaments)
    } else {
      this.view = new View(undefined, $view)
    }

    /*
       * Note: for some unknown reason, the prototype chain ignores
       * 'prototype.destroy'
       */
    this.destroy = GenericTournamentView.destroy
  }
  extend(GenericTournamentView, View)

  GenericTournamentView.destroy = function () {
    this.view.destroy()
    GenericTournamentView.superclass.destroy.call(this)
  }

  return GenericTournamentView
})
