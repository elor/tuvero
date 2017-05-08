/**
 * RankingVotesComponent
 *
 * @return RankingVotesComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingcomponent'], //
function(extend, RankingComponent) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   * @param nextcomponent
   *          the next component in the chain
   */
  function RankingVotesComponent(ranking, nextcomponent) {
    RankingVotesComponent.superconstructor.call(this, ranking, nextcomponent);
  }
  extend(RankingVotesComponent, RankingComponent);

  RankingVotesComponent.NAME = 'votes';

  /**
   * @param i
   *          a team index
   * @return a string representation of the votes
   */
  RankingVotesComponent.prototype.value = function(i) {
    return this.ranking.votes.get(i);
  };

  /**
   * skip this component for ranking. It's not a valid component, just a
   * visualization
   *
   * @return the result of the next component's ranking
   */
  RankingVotesComponent.prototype.compare = function(i, k) {
    return this.nextcomponent.compare(i, k);
  };

  return RankingVotesComponent;
});
