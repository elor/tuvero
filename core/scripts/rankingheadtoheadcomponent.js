/**
 * RankingHeadToHeadComponent
 *
 * @return RankingHeadToHeadComponent
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
      function RankingHeadToHeadComponent(ranking) {
        RankingHeadToHeadComponent.superconstructor.call(this, ranking,
            undefined);
      }
      extend(RankingHeadToHeadComponent, RankingComponent);

      RankingHeadToHeadComponent.NAME = 'headtohead';
      RankingHeadToHeadComponent.DEPENDENCIES = ['headtoheadmatrix'];

      RankingHeadToHeadComponent.prototype.compare = function(i, k) {
        return this.ranking.headtoheadmatrix.get(k, i)
            || this.nextcomponent.compare(i, k);
      };

      return RankingHeadToHeadComponent;
    });
