/**
 * RankingPlacementComponent: rank by team id
 *
 * @return RankingPlacementComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingcomponent'], function (extend, //
  RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingPlacementComponent (ranking, nextcomponent) {
    RankingPlacementComponent.superconstructor.call(this, ranking, nextcomponent)
  }
  extend(RankingPlacementComponent, RankingComponent)

  RankingPlacementComponent.NAME = 'placement'

  RankingPlacementComponent.prototype.isPrimary = function () {
    return false
  }

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingPlacementComponent.prototype.value = function (i) {
    return 1 + i - (i % 2)
  }

  RankingPlacementComponent.prototype.compare = function (i, k) {
    return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k)
  }

  return RankingPlacementComponent
})
