/**
 * RankingThreePointComponent: rank by team id
 *
 * @return RankingThreePointComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingcomponent'], function(extend, //
RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingThreePointComponent(ranking, nextcomponent) {
    RankingThreePointComponent.superconstructor.call(this, ranking, nextcomponent);
  }
  extend(RankingThreePointComponent, RankingComponent);

  RankingThreePointComponent.NAME = 'threepoint';

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingThreePointComponent.prototype.value = function(i) {
    return this.ranking.threepoint.get(i);
  };

  return RankingThreePointComponent;
});
