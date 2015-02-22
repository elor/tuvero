/**
 * GamesRankingComponent: rank by player id
 *
 * @return GamesRankingComponent
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
      function GamesRankingComponent(ranking, nextcomponent) {
        GamesRankingComponent.superconstructor.call(this, ranking,
            nextcomponent);
      }
      extend(GamesRankingComponent, RankingComponent);

      GamesRankingComponent.NAME = 'id';

      /**
       * @param i
       *          a player index
       * @return the number of won games
       */
      GamesRankingComponent.prototype.value = function(i) {
        return this.ranking.numgames.get(i);
      };

      return GamesRankingComponent;
    });
