/**
 * RankingNumGamesListener
 *
 * @return RankingNumGamesListener
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
  function RankingNumGamesListener(ranking) {
    RankingNumGamesListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingNumGamesListener, RankingDataListener);

  RankingNumGamesListener.NAME = 'numgames';
  RankingNumGamesListener.DEPENDENCIES = undefined;

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
  RankingNumGamesListener.prototype.onresult = function(r, e, result) {
    result.player.forEach(function(player) {
      this.numgames.set(player, this.numgames.get(player) + 1);
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param correction
   *          a game correction
   */
  RankingNumGamesListener.prototype.oncorrect = function(r, e, correction) {
    console.error('RankingNumGamesListener.oncorrect() not implemented yet');
  };

  return RankingNumGamesListener;
});
