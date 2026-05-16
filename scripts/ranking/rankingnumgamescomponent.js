/**
 * RankingNumGamesComponent
 *
 * @return RankingNumGamesComponent
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
function RankingNumGamesComponent(ranking, nextcomponent) {
  RankingNumGamesComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingNumGamesComponent, RankingComponent);
RankingNumGamesComponent.NAME = 'numgames';

/**
* @param i
*          a team index
* @return the number of won games
*/
RankingNumGamesComponent.prototype.value = function (i) {
  return this.ranking.numgames.get(i);
};
export default RankingNumGamesComponent;