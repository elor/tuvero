/**
 * RankingPointsListener
 *
 * @return RankingPointsListener
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
  function RankingPointsListener(ranking) {
    RankingPointsListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingPointsListener, RankingDataListener);

  RankingPointsListener.NAME = 'points';
  RankingPointsListener.DEPENDENCIES = undefined;

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  RankingPointsListener.prototype.oninsert = function(r, e, result) {
    result.player.forEach(function(player, index) {
      this.points.set(player, this.points.get(player) + result.points[index]);
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param correction
   *          a game correction
   */
  RankingPointsListener.prototype.oncorrect = function(r, e, correction) {
    console.error('RankingPointsListener.oncorrect() not implemented yet');
  };

  return RankingPointsListener;
});
