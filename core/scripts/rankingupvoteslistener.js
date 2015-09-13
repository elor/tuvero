/**
 * RankingUpvotesListener
 *
 * @return RankingUpvotesListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './vectormodel'], function(
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

  RankingUpvotesListener.NAME = 'upvotes';
  RankingUpvotesListener.DEPENDENCIES = undefined;

  return RankingUpvotesListener;
});
