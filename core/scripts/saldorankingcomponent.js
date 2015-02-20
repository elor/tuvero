/**
 * SaldoRankingComponent: rank by player id
 *
 * @return SaldoRankingComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingcomponent'],
    function(extend, RankingComponent) {
      /**
       * Constructor
       *
       * @param ranking
       *          a RankingModel instance
       * @param nextcomponent
       *          the next component in the chain
       */
      function SaldoRankingComponent(ranking, nextcomponent) {
        SaldoRankingComponent.superconstructor
            .call(this, ranking, nextcomponent);
      }
      extend(SaldoRankingComponent, RankingComponent);

      SaldoRankingComponent.NAME = 'saldo';

      /**
       * @param i
       *          a player index
       * @return the point difference, aka. saldo points
       */
      SaldoRankingComponent.prototype.value = function(i) {
        return this.ranking.saldo[i];
      };

      return SaldoRankingComponent;
    });
