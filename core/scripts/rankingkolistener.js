/**
 * RankingKOListener
 *
 * @return RankingKOListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './vectormodel'], function(
    extend, RankingDataListener, VectorModel) {
  var KOTournamentModel;

  KOTournamentModel = undefined;

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

    result.teams.forEach(function(teamid, index) {
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
  RankingKOListener.prototype.onresult = function(r, e, result) {
    var matchID, group, loser;

    matchID = result.getID();
    group = result.getGroup();
    loser = getLoser(result);

    if (loser === undefined) {
      console.error('there is no loser. just pick the second team.');
      loser = result.getTeamID(1);
    }

    if (matchID <= 1) {
      this.ko.set(loser, -2 * group - 1);
    } else {
      if (!KOTournamentModel) {
        KOTournamentModel = require('core/kotournamentmodel');
      }

      this.ko.set(loser, -2 * KOTournamentModel.loserGroupID(group, matchID));
    }
  };

  return RankingKOListener;
});
