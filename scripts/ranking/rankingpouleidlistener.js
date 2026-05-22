import extend from '../lib/extend.js';
import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
function RankingPouleIDListener(ranking) {
  RankingPouleIDListener.superconstructor.call(this, ranking, new VectorModel());
}
extend(RankingPouleIDListener, RankingDataListener);
RankingPouleIDListener.NAME = 'pouleid';
RankingPouleIDListener.DEPENDENCIES = undefined;
RankingPouleIDListener.prototype.onresult = function (r, e, result) {
  const poule = result.getGroup();
  result.teams.forEach(function (teamid) {
    this.pouleid.set(teamid, poule);
  }, this);
};
RankingPouleIDListener.prototype.oncorrect = function (r, e, correction) {
  this.onresult(r, e, correction.after);
};
export default RankingPouleIDListener;