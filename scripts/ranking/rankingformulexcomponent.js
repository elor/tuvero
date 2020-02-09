/**
 * RankingFormuleXComponent: Formule X
 *
 * @return RankingFormuleXComponent
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
    function RankingFormuleXComponent (ranking, nextcomponent) {
      RankingFormuleXComponent.superconstructor.call(this, ranking, nextcomponent)
    }
    extend(RankingFormuleXComponent, RankingComponent)

    RankingFormuleXComponent.NAME = 'formulex'

    /**
   * @param i
   *          a team index
   * @return the point difference, aka. formulex points
   */
    RankingFormuleXComponent.prototype.value = function (i) {
      return this.ranking.formulex.get(i)
    }

    return RankingFormuleXComponent
  })
