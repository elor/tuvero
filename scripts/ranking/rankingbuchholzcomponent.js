/**
 * RankingBuchholzComponent
 *
 * @return RankingBuchholzComponent
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
function RankingBuchholzComponent(ranking, nextcomponent) {
  RankingBuchholzComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingBuchholzComponent, RankingComponent);
RankingBuchholzComponent.NAME = 'buchholz';

/**
* @param i
*          a team index
* @return the number of won games
*/
RankingBuchholzComponent.prototype.value = function (i) {
  return this.ranking.buchholz.get(i);
};
export default RankingBuchholzComponent;