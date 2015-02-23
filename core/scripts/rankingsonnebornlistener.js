/**
 * RankingSonnebornListener
 *
 * @return RankingSonnebornListener
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
  function RankingSonnebornListener(ranking) {
    RankingSonnebornListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingSonnebornListener, RankingDataListener);

  RankingSonnebornListener.NAME = 'sonneborn';
  RankingSonnebornListener.DEPENDENCIES = ['winsmatrix', 'wins'];

  RankingSonnebornListener.prototype.onrecalc = function() {
    this.winsmatrix.multVector(this.sonneborn, this.wins);
  };

  return RankingSonnebornListener;
});
