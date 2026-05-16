/**
 * RankingSaldoListener
 *
 * @return RankingSaldoListener
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
function RankingSaldoListener(ranking) {
  RankingSaldoListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingSaldoListener, RankingDataListener);
RankingSaldoListener.NAME = 'saldo';
RankingSaldoListener.DEPENDENCIES = ['points', 'lostpoints'];
RankingSaldoListener.prototype.onrecalc = function () {
  this.saldo.sum(this.points, this.lostpoints);
};
export default RankingSaldoListener;