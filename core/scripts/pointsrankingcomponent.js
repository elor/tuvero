/**
 * PointsRankingComponent
 *
 * @return PointsRankingComponent
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
      function PointsRankingComponent(ranking, nextcomponent) {
        PointsRankingComponent.superconstructor.call(this, ranking,
            nextcomponent);
      }
      extend(PointsRankingComponent, RankingComponent);

      PointsRankingComponent.NAME = 'points';

      /**
       * @param i
       *          a player index
       * @return the small points: won points, without subtracting lost points
       */
      PointsRankingComponent.prototype.value = function(i) {
        return this.ranking.points.get(i);
      };

      return PointsRankingComponent;
    });
