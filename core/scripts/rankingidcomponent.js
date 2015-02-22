/**
 * RankingIDComponent: rank by player id
 *
 * @return RankingIDComponent
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
      function RankingIDComponent(ranking) {
        RankingIDComponent.superconstructor.call(this, ranking, undefined);
      }
      extend(RankingIDComponent, RankingComponent);

      RankingIDComponent.NAME = 'id';

      /**
       * simply return the id. This always leads to a non-equal comparison.
       *
       * @param i
       *          a player index
       * @return the player index, for sorting
       */
      RankingIDComponent.prototype.value = function(i) {
        return i;
      };

      return RankingIDComponent;
    });
