/**
 * RankingUpvotesListener
 *
 * @return RankingUpvotesListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel'], function(
    extend, RankingDataListener, VectorModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingUpvotesListener(ranking) {
    RankingUpvotesListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingUpvotesListener, RankingDataListener);

  /**
   * override the 'isPrimary()' function: Don't check for specialties, just make
   * it save stuff.
   *
   * @return true
   */
  RankingUpvotesListener.prototype.isPrimary = function() {
    return true;
  };

  RankingUpvotesListener.NAME = 'upvotes';
  RankingUpvotesListener.DEPENDENCIES = undefined;

  return RankingUpvotesListener;
});
