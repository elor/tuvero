/**
 * SwissTournamentModel
 *
 * @return SwissTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './roundtournamentmodel', 'backend/random'], function(
    extend, RoundTournamentModel, Random) {
  var rng = new Random();

  /**
   * @param ranking
   *          a RankingModel instance
   * @return an array of arrays, where the inner array contains team ids which
   *         have the same rank, and outer array is ordered from best to worst
   *         rank
   */
  function getRankGroups(ranking) {
    var rankGroups, sameRanks, lastrank;

    sameRanks = [];
    rankGroups = [sameRanks];
    lastrank = undefined;

    ranking.displayOrder.forEach(function(teamid) {
      var rank = ranking.ranks[teamid];
      if (rank !== lastrank) {
        lastrank = rank;
        if (sameRanks && sameRanks.length) {
          sameRanks = [];
          rankGroups.push(sameRanks);
        }
      }
      sameRanks.push(teamid);
    });

    return rankGroups;
  }

  /**
   * in every rank group, randomize the team order
   *
   * @param rankGroups
   *          a getRankGroups() result
   * @return a rankGroup 2d array where the order of the inner arrays is random
   */
  function randomizeRankGroups(rankGroups) {
    return rankGroups.map(function(group) {
      var newgroup;
      newgroup = [];

      while (group.length) {
        newgroup.push(rng.pickAndRemove(group));
      }

      return newgroup;
    });
  }

  /**
   * Constructor
   *
   * @param rankingorder
   */
  function SwissTournamentModel(rankingorder) {
    SwissTournamentModel.superconstructor.call(this, rankingorder);

    this.setProperty('initialorder', 'random');
    this.setProperty('idleorder', 'order');
  }
  extend(SwissTournamentModel, RoundTournamentModel);

  SwissTournamentModel.prototype.SYSTEM = 'swiss';

  SwissTournamentModel.prototype.RANKINGDEPENDENCIES = ['gamematrix'];

  SwissTournamentModel.prototype.ORDERS = ['order', 'halves', 'wingroups',
      'random'];

  /**
   * creates new matches depending on the current ranking within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.idleMatches = function() {
    var rankGroups;

    if (this.getProperty('initialorder') === 'wingroups') {
      this.emit('error', 'cannot use wingroups at the moments');
      return false;
    }

    rankGroups = getRankGroups(this.ranking.get());
    rankGroups = randomizeRankGroups(rankGroups);

    debugger;
  };

  /**
   * creates new matches depending on the initial within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.initialMatches = function() {
    return this.idleMatches();
  };

  return SwissTournamentModel;
});
