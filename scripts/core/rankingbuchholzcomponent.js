/**
 * RankingBuchholzComponent
 *
 * @return RankingBuchholzComponent
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
  function RankingBuchholzComponent(ranking, nextcomponent) {
    RankingBuchholzComponent.superconstructor
        .call(this, ranking, nextcomponent);
  }
  extend(RankingBuchholzComponent, RankingComponent);

  RankingBuchholzComponent.NAME = 'buchholz';

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingBuchholzComponent.prototype.value = function(i) {
    return this.ranking.buchholz.get(i);
  };

  return RankingBuchholzComponent;
});
