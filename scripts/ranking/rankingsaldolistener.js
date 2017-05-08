/**
 * RankingSaldoListener
 *
 * @return RankingSaldoListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
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
  function RankingSaldoListener(ranking) {
    RankingSaldoListener.superconstructor
        .call(this, ranking, new VectorModel());
  }
  extend(RankingSaldoListener, RankingDataListener);

  RankingSaldoListener.NAME = 'saldo';
  RankingSaldoListener.DEPENDENCIES = ['points', 'lostpoints'];

  RankingSaldoListener.prototype.onrecalc = function() {
    this.saldo.add(this.points, this.lostpoints);
  };

  return RankingSaldoListener;
});
