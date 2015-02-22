/**
 * WinsRankingComponent: rank by player id
 *
 * @return WinsRankingComponent
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
      function WinsRankingComponent(ranking, nextcomponent) {
        WinsRankingComponent.superconstructor
            .call(this, ranking, nextcomponent);
      }
      extend(WinsRankingComponent, RankingComponent);

      WinsRankingComponent.NAME = 'id';

      /**
       * @param i
       *          a player index
       * @return the number of won games
       */
      WinsRankingComponent.prototype.value = function(i) {
        return this.ranking.wins.get(i);
      };

      return WinsRankingComponent;
    });
