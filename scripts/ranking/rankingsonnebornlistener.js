/**
 * RankingSonnebornListener
 *
 * @return RankingSonnebornListener
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
function RankingSonnebornListener(ranking) {
  RankingSonnebornListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingSonnebornListener, RankingDataListener);
RankingSonnebornListener.NAME = 'sonneborn';
RankingSonnebornListener.DEPENDENCIES = ['winsmatrix', 'wins'];
RankingSonnebornListener.prototype.onrecalc = function () {
  // TODO exclude bye from sonneborn points?
  this.winsmatrix.multVector(this.sonneborn, this.wins);
};
export default RankingSonnebornListener;