/**
 * RankingDownvotesListener
 *
 * @return RankingDownvotesListener
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
function RankingDownvotesListener(ranking) {
  RankingDownvotesListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingDownvotesListener, RankingDataListener);

/**
 * override the 'isPrimary()' function: Don't check for specialties, just make
 * it save stuff.
 *
 * @return true
 */
RankingDownvotesListener.prototype.isPrimary = function () {
  return true;
};
RankingDownvotesListener.NAME = 'downvotes';
RankingDownvotesListener.DEPENDENCIES = undefined;
export default RankingDownvotesListener;