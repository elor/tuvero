/**
 * RankingTacListener
 *
 * @return RankingTacListener
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
  function RankingTacListener(ranking) {
    RankingTacListener.superconstructor.call(this, ranking, new VectorModel());
  }
  extend(RankingTacListener, RankingDataListener);

  RankingTacListener.NAME = 'tac';
  RankingTacListener.DEPENDENCIES = ['points', 'wins'];

  // FIXME extract "12" to the config.
  RankingTacListener.prototype.onrecalc = function() {
    this.tac.mult(12, this.wins);
    this.tac.add(this.points);
  };

  return RankingTacListener;
});
