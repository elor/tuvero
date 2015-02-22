/**
 * RankingGamesComponent: rank by player id
 *
 * @return RankingGamesComponent
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
      function RankingGamesComponent(ranking, nextcomponent) {
        RankingGamesComponent.superconstructor.call(this, ranking,
            nextcomponent);
      }
      extend(RankingGamesComponent, RankingComponent);

      RankingGamesComponent.NAME = 'games';

      /**
       * @param i
       *          a player index
       * @return the number of won games
       */
      RankingGamesComponent.prototype.value = function(i) {
        return this.ranking.numgames.get(i);
      };

      return RankingGamesComponent;
    });
