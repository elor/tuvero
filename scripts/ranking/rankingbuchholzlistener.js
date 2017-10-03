/**
 * RankingBuchholzListener
 *
 * @return RankingBuchholzListener
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
  function RankingBuchholzListener(ranking) {
    RankingBuchholzListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingBuchholzListener, RankingDataListener);

  RankingBuchholzListener.NAME = 'buchholz';
  RankingBuchholzListener.DEPENDENCIES = ['gamematrix', 'wins'];

  RankingBuchholzListener.prototype.onrecalc = function() {
    this.gamematrix.multVector(this.buchholz, this.wins);
  };

  return RankingBuchholzListener;
});
