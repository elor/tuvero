/**
 * RankingWinsComponent: rank by team id
 *
 * @return RankingWinsComponent
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
function RankingWinsComponent(ranking, nextcomponent) {
  RankingWinsComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingWinsComponent, RankingComponent);
RankingWinsComponent.NAME = 'wins';

/**
 * @param i
 *          a team index
 * @return the number of won games
 */
RankingWinsComponent.prototype.value = function (i) {
  return this.ranking.wins.get(i);
};
export default RankingWinsComponent;