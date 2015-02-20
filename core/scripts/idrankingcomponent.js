/**
 * IDRankingComponent: rank by player id
 *
 * @return IDRankingComponent
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
       */
      function IDRankingComponent(ranking) {
        IDRankingComponent.superconstructor.call(this, ranking, undefined);
      }
      extend(IDRankingComponent, RankingComponent);

      IDRankingComponent.NAME = 'id';

      /**
       * simply return the id. This always leads to a non-equal comparison.
       *
       * @param i
       *          a player index
       * @return the player index, for sorting
       */
      IDRankingComponent.prototype.value = function(i) {
        return i;
      };

      return IDRankingComponent;
    });
