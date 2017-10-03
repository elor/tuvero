/**
 * RankingFinebuchholzComponent
 *
 * @return RankingFinebuchholzComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingcomponent'], //
function(extend, RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingFinebuchholzComponent(ranking, nextcomponent) {
    RankingFinebuchholzComponent.superconstructor.call(this, ranking,
        nextcomponent);
  }
  extend(RankingFinebuchholzComponent, RankingComponent);

  RankingFinebuchholzComponent.NAME = 'finebuchholz';

  /**
   * @param i
   *          a team index
   * @return the number of won games
   */
  RankingFinebuchholzComponent.prototype.value = function(i) {
    return this.ranking.finebuchholz.get(i);
  };

  return RankingFinebuchholzComponent;
});
