import extend from '../lib/extend.js';
import RankingComponent from './rankingcomponent.js';
function RankingPouleIDComponent(ranking, nextcomponent) {
  RankingPouleIDComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingPouleIDComponent, RankingComponent);
RankingPouleIDComponent.NAME = 'pouleid';
RankingPouleIDComponent.DEPENDENCIES = undefined;
RankingPouleIDComponent.prototype.value = function (i) {
  return Number(this.ranking.pouleid.get(i)) + 1;
};
RankingPouleIDComponent.prototype.compare = function (i, k) {
  return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k);
};
export default RankingPouleIDComponent;