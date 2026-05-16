/**
 * RankingPlacementListener
 *
 * @return RankingPlacementListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
function RankingPlacementListener(ranking) {
  RankingPlacementListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingPlacementListener, RankingDataListener);
RankingPlacementListener.NAME = 'placement';
export default RankingPlacementListener;