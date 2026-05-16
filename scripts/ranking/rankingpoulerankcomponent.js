import extend from '../lib/extend.js';
import RankingComponent from './rankingcomponent.js';
function RankingPouleRankComponent(ranking, nextcomponent) {
  RankingPouleRankComponent.superconstructor.call(this, ranking, nextcomponent);
}
extend(RankingPouleRankComponent, RankingComponent);
RankingPouleRankComponent.NAME = 'poulerank';
RankingPouleRankComponent.DEPENDENCIES = ['poulerank', 'wins', 'saldo', 'points'];
RankingPouleRankComponent.prototype.value = function (i) {
  return Number(this.ranking.poulerank.get(i)) + 1;
};
RankingPouleRankComponent.prototype.compare = function (i, k) {
  return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k);
};
export default RankingPouleRankComponent;