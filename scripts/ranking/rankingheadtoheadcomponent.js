/**
 * RankingHeadToHeadComponent
 *
 * @return RankingHeadToHeadComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingcomponent'], //
  function (extend, RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the component chain
   */
    function RankingHeadToHeadComponent (ranking, nextcomponent) {
      RankingHeadToHeadComponent.superconstructor.call(this, ranking,
        nextcomponent)
    }
    extend(RankingHeadToHeadComponent, RankingComponent)

    RankingHeadToHeadComponent.NAME = 'headtohead'

    /**
   * @param i
   *          a team index
   * @return the headtohead value, i.e. how often the team has won against
   *         another with the same number of wins
   */
    RankingHeadToHeadComponent.prototype.value = function (i) {
      return this.ranking.headtohead.get(i) || ''
    }

    return RankingHeadToHeadComponent
  })
