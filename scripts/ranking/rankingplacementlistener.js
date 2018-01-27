/**
 * RankingPlacementListener
 *
 * @return RankingPlacementListener
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
  function RankingPlacementListener(ranking) {
    RankingPlacementListener.superconstructor.call(this, ranking, new VectorModel());
  }
  extend(RankingPlacementListener, RankingDataListener);

  RankingPlacementListener.NAME = 'placement';

  return RankingPlacementListener;
});
