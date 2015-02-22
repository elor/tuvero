/**
 * RankingLostPointsListener
 *
 * @return RankingLostPointsListener
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
  function RankingLostPointsListener(ranking) {
    RankingLostPointsListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingLostPointsListener, RankingDataListener);

  RankingLostPointsListener.NAME = 'lostpoints';
  RankingLostPointsListener.DEPENDENCIES = undefined;

  /**
   * insert the results of a game into the ranking.
   *
   * We cannot make the assumption that there's only one opponent. That's why we
   * iterate over every player as a possible opponent and apply his points to
   * every other player's lostpoints vector.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  RankingLostPointsListener.prototype.oninsert = function(r, e, result) {
    result.player.forEach(function(opponent, index) {
      result.player.forEach(function(player) {
        if (player !== opponent) {
          this.lostpoints.set(player, this.lostpoints.get(player)
              - result.points[index]);
        }
      });
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param correction
   *          a game correction
   */
  RankingLostPointsListener.prototype.oncorrect = function(r, e, correction) {
    console.error('RankingLostPointsListener.oncorrect() not implemented yet');
  };

  return RankingLostPointsListener;
});
