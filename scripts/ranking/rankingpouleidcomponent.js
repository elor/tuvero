define(["lib/extend", "ranking/rankingcomponent"], function (extend, RankingComponent) {
  function RankingPouleIDComponent(ranking) {
    RankingPouleIDComponent.superconstructor.call(this, ranking, undefined);
  }
  extend(RankingPouleIDComponent, RankingComponent);

  RankingPouleIDComponent.NAME = "pouleid";
  RankingPouleIDComponent.DEPENDENCIES = undefined;

  RankingPouleIDComponent.prototype.value = function (i) {
    return Number(this.ranking.pouleid.get(i)) + 1;
  };

  RankingPouleIDComponent.prototype.compare = function (i, k) {
    return -RankingPouleIDComponent.superclass.compare.call(this, i, k);
  };

  return RankingPouleIDComponent;
});