/**
 * RankingNumGamesComponent
 *
 * @return RankingNumGamesComponent
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
   *          the next component in the chain
   */
    function RankingNumGamesComponent (ranking, nextcomponent) {
      RankingNumGamesComponent.superconstructor
        .call(this, ranking, nextcomponent)
    }
    extend(RankingNumGamesComponent, RankingComponent)

    RankingNumGamesComponent.NAME = 'numgames'

    /**
   * @param i
   *          a team index
   * @return the number of won games
   */
    RankingNumGamesComponent.prototype.value = function (i) {
      return this.ranking.numgames.get(i)
    }

    return RankingNumGamesComponent
  })
