/**
 * PlacementTournamentView
 *
 * @return PlacementTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import TournamentView from './tournamentview.js';
function PlacementTournamentView(model, $view, tournaments) {
  PlacementTournamentView.superconstructor.call(this, model, $view, tournaments);
}
extend(PlacementTournamentView, TournamentView);
export default PlacementTournamentView;