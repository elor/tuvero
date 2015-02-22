/**
 * RankingBuchholzListener
 *
 * @return RankingBuchholzListener
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
