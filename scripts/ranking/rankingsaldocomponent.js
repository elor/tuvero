/**
 * RankingSaldoComponent
 *
 * @return RankingSaldoComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import RankingComponent from './rankingcomponent.js';
/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 * @param nextcomponent
 *          the next component in the chain
 */
function RankingSaldoComponent(ranking, nextcomponent) {
  RankingSaldoComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingSaldoComponent, RankingComponent);
RankingSaldoComponent.NAME = 'saldo';

/**
* @param i
*          a team index
* @return the point difference, aka. saldo points
*/
RankingSaldoComponent.prototype.value = function (i) {
  return this.ranking.saldo.get(i);
};
export default RankingSaldoComponent;