/**
 * RankingLostPointsComponent
 *
 * @return RankingLostPointsComponent
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
  function RankingLostPointsComponent(ranking, nextcomponent) {
    RankingLostPointsComponent.superconstructor.call(this, ranking,
        nextcomponent);
  }
  extend(RankingLostPointsComponent, RankingComponent);

  RankingLostPointsComponent.NAME = 'lostpoints';

  /**
   * @param i
   *          a team index
   * @return the small points: won points, without subtracting lost points
   */
  RankingLostPointsComponent.prototype.value = function(i) {
    return this.ranking.lostpoints.get(i);
  };

  return RankingLostPointsComponent;
});
