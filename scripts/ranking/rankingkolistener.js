/**
 * RankingKOListener
 *
 * @return RankingKOListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel'], function (
  extend, RankingDataListener, VectorModel) {
  var KOTournamentModel = undefined;

  /**
   * @param result
   *          a MatchResult instance
   * @return the index of the loser (for result.getTeamID(index)), or undefined
   *         if no unique loser exists
   */
  function getLoser(result) {
    var loser, minpoints;

    loser = undefined;
    minpoints = undefined;

    result.teams.forEach(function (teamid, index) {
      var points;
      points = result.score[index];
      if (minpoints === undefined || points < minpoints) {
        loser = teamid;
        minpoints = points;
      } else if (points === minpoints) {
        loser = undefined;
      }
    }, this);

    return loser;
  }

  function getWinner(result) {
    var winner, maxpoints;

    winner = undefined;
    maxpoints = undefined;

    result.teams.forEach(function (teamid, index) {
      var points;
      points = result.score[index];
      if (maxpoints === undefined || points > maxpoints) {
        winner = teamid;
        maxpoints = points;
      } else if (points === maxpoints) {
        winner = undefined;
      }
    }, this);

    return winner;
  }

  function getWinnerPoints(result) {
    return -2 * result.getGroup();
  }

  function getLoserPoints(result) {
    var group = result.getGroup();
    var matchID = result.getID();
    KOTournamentModel = KOTournamentModel || require('tournament/kotournamentmodel');

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

  RankingKOListener.NAME = 'ko';
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
    this.ko.set(getLoser(result), getLoserPoints(result));
    this.ko.set(getWinner(result), getWinnerPoints(result));
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

    winner = getWinner(correction.before);
    loser = getLoser(correction.before);
    winnerPoints = getWinnerPoints(correction.before);
    loserPoints = getLoserPoints(correction.before);

    if (this.ko.get(winner) !== winnerPoints || this.ko.get(loser) !== loserPoints) {
      return;
    }

    this.onresult(r, e, correction.after);
  };

  return RankingKOListener;
});
