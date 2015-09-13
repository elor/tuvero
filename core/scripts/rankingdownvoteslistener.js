/**
 * RankingDownvotesListener
 *
 * @return RankingDownvotesListener
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
  function RankingDownvotesListener(ranking) {
    RankingDownvotesListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingDownvotesListener, RankingDataListener);

  RankingDownvotesListener.NAME = 'downvotes';
  RankingDownvotesListener.DEPENDENCIES = undefined;

  return RankingDownvotesListener;
});
