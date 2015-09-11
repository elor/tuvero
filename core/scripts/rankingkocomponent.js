/**
 * RankingKOComponent: rank by team id
 *
 * @return RankingKOComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingcomponent'], function(extend, //
RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingKOComponent(ranking, nextcomponent) {
    RankingKOComponent.superconstructor.call(this, ranking, nextcomponent);
  }
  extend(RankingKOComponent, RankingComponent);

  RankingKOComponent.NAME = 'ko';

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingKOComponent.prototype.value = function(i) {
    return this.ranking.ko.get(i);
  };

  return RankingKOComponent;
});
