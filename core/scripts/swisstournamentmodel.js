/**
 * SwissTournamentModel
 *
 * @return SwissTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './roundtournamentmodel', 'backend/random',
    './matchmodel', './byeresult', 'options'], function(extend,
    RoundTournamentModel, Random, MatchModel, ByeResult, Options) {
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
   * @param outMatches
   * @param outByes
   * @param rankGroups
   * @param gamematrix
   * @param byes
   * @param numTeams
   * @return true on success, false otherwise
   */
  function traverseByes(outMatches, outByes, rankGroups, gamematrix, byes,
      numTeams) {
    var reverseRankGroups;

    if (numTeams % 2) {
      reverseRankGroups = rankGroups.slice(0).reverse();

      reverseRankGroups.some(function(group) {
        return group.some(function(teamid, index) {
          if (byes.get(teamid)) {
            return false;
          }

          group.splice(index, 1);
          if (traverseAndBacktrack(outMatches, rankGroups, gamematrix)) {
            outByes.push(teamid);
            return true;
          }

          group.splice(index, 0, teamid);

          return false;
        });
      });
    }

    return traverseAndBacktrack(outMatches, rankGroups, gamematrix);
  }

  /**
   * counts the number of teams remaining in the rank groups
   *
   * @param rankGroups
   *          a rankGroups object, as returned by getRankGroups
   * @return the number of teams in the rank group
   */
  function getRankGroupsTeamCount(rankGroups) {
    var sum = 0;

    rankGroups.forEach(function(group) {
      sum += group.length;
    });

    return sum;
  }

  /**
   * @param outMatches
   * @param rankGroups
   * @param gamematrix
   * @return true on success, false otherwise
   */
  function traverseAndBacktrack(outMatches, rankGroups, gamematrix) {
    var currentGroup, secondGroup, teamA, teamB, teamBindex;

    // console.log(getRankGroupsTeamCount(rankGroups));
    // console.log(JSON.stringify(rankGroups));

    currentGroup = undefined;

    // get firstGroupIndex by searching for the first non-empty group
    if (!rankGroups.some(function(group) {
      currentGroup = group;
      return group.length > 0;
    })) {
      // success! there's no team left
      return true;
    }

    teamA = currentGroup.shift();

    secondGroup = undefined;
    teamBindex = undefined;
    teamB = undefined;

    // try to find a match in the current group or the one after
    if (!rankGroups.some(function(group) {
      return group.some(function(team, index) {
        if (gamematrix.get(teamA, team) === 0) {
          secondGroup = group;
          teamB = team;
          teamBindex = index;
          return true;
        }
        return false;
      });
    })) {
      currentGroup.unshift(teamA);
      return false;
    }

    secondGroup.splice(teamBindex, 1);

    if (traverseAndBacktrack(outMatches, rankGroups, gamematrix)) {
      // don't use push, because the best-ranked team should be listed in the
      // first match
      outMatches.unshift([teamA, teamB]);
      return true;
    }

    currentGroup.splice(teamBindex, 0, teamB);
    currentGroup.unshift(teamA);

    return false;
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

  SwissTournamentModel.prototype.RANKINGDEPENDENCIES = ['byes', 'gamematrix'];

  SwissTournamentModel.prototype.ORDERS = ['order', 'halves', 'wingroups',
      'random'];

  /**
   * creates new matches depending on the current ranking within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.idleMatches = function() {
    var rankGroups, matches, byes;

    if (this.getProperty('initialorder') === 'wingroups') {
      this.emit('error', 'cannot use wingroups at the moments');
      return false;
    }

    rankGroups = getRankGroups(this.ranking.get());
    rankGroups = randomizeRankGroups(rankGroups);

    matches = [];
    byes = [];
    if (!traverseByes(matches, byes, rankGroups, this.ranking.gamematrix,
        this.ranking.byes, this.teams.length)) {
      this.emit('Teams have already met or all teams already have a bye');
      return false;
    }

    this.round += 1;

    byes.forEach(function(byeTeamID, byeIndex) {
      // TODO extract method
      this.votes.bye.push(byeTeamID);
      this.history.push(new ByeResult(byeTeamID, [Options.byepointswon,
          Options.byepointslost], matches.length + byeIndex, this.round));
      this.ranking.bye(byeTeamID);
    }, this);

    matches.forEach(function(matchTeams, matchid) {
      this.matches.push(new MatchModel(matchTeams, matchid, this.round));
    }, this);

    return true;
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
