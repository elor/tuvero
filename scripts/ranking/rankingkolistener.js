/**
 * RankingKOListener
 *
 * @return RankingKOListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ranking/rankingdatalistener", "math/vectormodel"], function (
  extend, RankingDataListener, VectorModel) {
  var KOTournamentModel;

  function getWinnerPoints(result) {
    return -2 * result.getGroup();
  }

  function getLoserPoints(result) {
    var group = result.getGroup();
    var matchID = result.getID();
    KOTournamentModel = KOTournamentModel || require("tournament/kotournamentmodel");

    if (matchID <= 1) {
      return -2 * group - 1;
    } else {
      return -2 * KOTournamentModel.loserGroupID(group, matchID);
    }
  }

  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingKOListener(ranking) {
    RankingKOListener.superconstructor.call(this, ranking, // autoformat
      new VectorModel());
  }
  extend(RankingKOListener, RankingDataListener);

  RankingKOListener.NAME = "ko";
  RankingKOListener.DEPENDENCIES = undefined;

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
  RankingKOListener.prototype.onresult = function (r, e, result) {
    this.ko.set(result.getLoser(), getLoserPoints(result));
    this.ko.set(result.getWinner(), getWinnerPoints(result));
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "correct"
   * @param correction
   *          a game correction
   */
  RankingKOListener.prototype.oncorrect = function (r, e, correction) {
    var winner, loser, winnerPoints, loserPoints;

    winner = correction.before.getWinner();
    loser = correction.before.getWinner();
    winnerPoints = getWinnerPoints(correction.before);
    loserPoints = getLoserPoints(correction.before);

    if (this.ko.get(winner) !== winnerPoints || this.ko.get(loser) !== loserPoints) {
      return;
    }

    this.onresult(r, e, correction.after);
  };

  return RankingKOListener;
});