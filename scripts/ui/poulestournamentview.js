/**
 * PoulesTournamentView
 *
 * @return PoulesTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/tournamentview'], function (extend, TournamentView) {
  function PoulesTournamentView(model, $view, tournaments) {
    PoulesTournamentView.superconstructor.call(this, model, $view, tournaments);
  }
  extend(PoulesTournamentView, TournamentView);

  return PoulesTournamentView;
});
