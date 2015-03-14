/**
 * RankingTacComponent: TAC-specific calculations
 *
 * @return RankingTacComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(
    ['lib/extend', './rankingcomponent'],
    function(extend, RankingComponent) {
      /**
       * Constructor
       *
       * @param ranking
       *          a RankingModel instance
       * @param nextcomponent
       *          the next component in the chain
       */
      function RankingTacComponent(ranking, nextcomponent) {
        RankingTacComponent.superconstructor.call(this, ranking, nextcomponent);
      }
      extend(RankingTacComponent, RankingComponent);

      RankingTacComponent.NAME = 'tac';

      /**
       * @param i
       *          a team index
       * @return the point difference, aka. tac points
       */
      RankingTacComponent.prototype.value = function(i) {
        return this.ranking.tac.get(i);
      };

      return RankingTacComponent;
    });
