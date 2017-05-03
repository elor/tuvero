/**
 * RankingPointsComponent
 *
 * @return RankingPointsComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingcomponent'], //
function(extend, RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingPointsComponent(ranking, nextcomponent) {
    RankingPointsComponent.superconstructor.call(this, ranking, //
    nextcomponent);
  }
  extend(RankingPointsComponent, RankingComponent);

  RankingPointsComponent.NAME = 'points';

  /**
   * @param i
   *          a team index
   * @return the small points: won points, without subtracting lost points
   */
  RankingPointsComponent.prototype.value = function(i) {
    return this.ranking.points.get(i);
  };

  return RankingPointsComponent;
});
