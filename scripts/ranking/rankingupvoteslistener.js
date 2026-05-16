/**
 * RankingUpvotesListener
 *
 * @return RankingUpvotesListener
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
function RankingUpvotesListener(ranking) {
  RankingUpvotesListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingUpvotesListener, RankingDataListener);

/**
 * override the 'isPrimary()' function: Don't check for specialties, just make
 * it save stuff.
 *
 * @return true
 */
RankingUpvotesListener.prototype.isPrimary = function () {
  return true;
};
RankingUpvotesListener.NAME = 'upvotes';
RankingUpvotesListener.DEPENDENCIES = undefined;
export default RankingUpvotesListener;