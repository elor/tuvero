/**
 * PlacementTournamentView
 *
 * @return PlacementTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/tournamentview'], function (extend, TournamentView) {
  function PlacementTournamentView (model, $view, tournaments) {
    PlacementTournamentView.superconstructor.call(this, model, $view, tournaments)
  }
  extend(PlacementTournamentView, TournamentView)

  return PlacementTournamentView
})
