/**
 * RankingTwoPointComponent: rank by team id
 *
 * @return RankingTwoPointComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ranking/rankingcomponent"], function (extend, //
RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingTwoPointComponent(ranking, nextcomponent) {
    RankingTwoPointComponent.superconstructor.call(this, ranking, nextcomponent);
  }
  extend(RankingTwoPointComponent, RankingComponent);

  RankingTwoPointComponent.NAME = "twopoint";

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingTwoPointComponent.prototype.value = function (i) {
    return this.ranking.twopoint.get(i);
  };

  return RankingTwoPointComponent;
});
