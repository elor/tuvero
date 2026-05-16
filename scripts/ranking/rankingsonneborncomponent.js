/**
 * RankingSonnebornComponent
 *
 * @return RankingSonnebornComponent
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
function RankingSonnebornComponent(ranking, nextcomponent) {
  RankingSonnebornComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingSonnebornComponent, RankingComponent);
RankingSonnebornComponent.NAME = 'sonneborn';

/**
* @param i
*          a team index
* @return the number of won games
*/
RankingSonnebornComponent.prototype.value = function (i) {
  return this.ranking.sonneborn.get(i);
};
export default RankingSonnebornComponent;