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

  RankingTacListener.prototype.onresult = function(r, e, result) {
    var winscore, winner, loser, diff, points;

    // FIXME extract "12" to the config.
    winscore = 12;

    if (result.players.length !== 2) {
      throw new Error('TAC ranking requires exactly two teams in a result');
    }

    diff = result.points[0] - result.points[1];
    switch (Math.sign(diff)) {
    case -1:
      winner = 1;
      loser = 0;
      diff = -diff;
      break;
    case 1:
      winner = 0;
      loser = 1;
      break;
    case 0:
    default:
      console.error('TAC ranking does not accept draws');
      return undefined;
    }

    // winner
    points = this.tac.get(result.players[winner]) + 12 + diff;
    this.tac.set(result.players[winner], points);

    // loser
    points = this.tac.get(result.players[loser]) + result.points[loser];
    this.tac.set(result.players[loser], points);
  };

  return RankingTacListener;
});
