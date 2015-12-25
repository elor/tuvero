/**
 * RankingHeadToHeadComponent
 *
 * @return RankingHeadToHeadComponent
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
   */
  function RankingHeadToHeadComponent(ranking) {
    RankingHeadToHeadComponent.superconstructor.call(this, ranking, undefined);
  }
  extend(RankingHeadToHeadComponent, RankingComponent);

  RankingHeadToHeadComponent.NAME = 'headtohead';

  /**
   * @param i
   *          a team index
   * @return the headtohead value, i.e. how often the team has won against
   *         another with the same number of wins
   */
  RankingHeadToHeadComponent.prototype.value = function(i) {
    return this.ranking.headtohead.get(i);
  };

  return RankingHeadToHeadComponent;
});
