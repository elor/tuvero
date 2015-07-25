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
   * Constructor
   *
   * @param rankingorder
   */
  function SwissTournamentModel(rankingorder) {
    SwissTournamentModel.superconstructor.call(this, rankingorder);

    this.setProperty('swissmode', SwissTournamentModel.MODES.ranks);
    this.setProperty('swissshuffle', true);
    this.setProperty('swisstranspose', false);
  }
  extend(SwissTournamentModel, RoundTournamentModel);

  SwissTournamentModel.prototype.SYSTEM = 'swiss';

  SwissTournamentModel.prototype.RANKINGDEPENDENCIES = ['byes', 'gamematrix'];

  SwissTournamentModel.MODES = {
    all: 'all',
    halves: 'halves',
    ranks: 'ranks',
    wins: 'wins',
    individual: 'individual',
    // TODO enable the use of global team ids (rangliste, elo, ...)
    globalteamid: undefined
  };

  /**
   * creates new matches depending on the current ranking within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.idleMatches = function() {
    var rankGroups, matches, byes, mode;

    /*
     * validate swiss mode
     */
    mode = this.getProperty('swissmode');

    if (SwissTournamentModel.MODES[mode] === undefined) {
      this.emit('error', 'invalid mode: ' + mode);
      return false;
    }

    rankGroups = SwissTournamentModel.getSwissGroups(this.ranking.get(), mode);

    /*
     * shuffle if wanted
     */
    if (this.getProperty('swissshuffle') === true) {
      rankGroups = SwissTournamentModel.shuffleGroupTeams(rankGroups);
    }

    /*
     * transpose if wanted
     */
    if (this.getProperty('swisstranspose') === true) {
      rankGroups = SwissTournamentModel.transposeGroups(rankGroups);
    }

    /*
     * use awesome algorithm to find an allowed solution
     */
    matches = [];
    byes = [];
    if (!SwissTournamentModel.traverseByes(matches, byes, rankGroups,
        this.ranking.gamematrix, this.ranking.byes, this.teams.length)) {
      this.emit('error',
          'Teams have already met or all teams already have a bye');
      return false;
    }

    /*
     * add the byes and matches to the current tournament
     */
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

    this.round += 1;

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

  /**
   * Internal function.
   *
   * Transposes the groups: takes one element from each group and places them
   * into a new group, in order.
   *
   * shuffle first, if you need to.
   *
   * @param groups
   *          2d groups array
   * @return a 2d groups array where the groups are transposed
   */
  SwissTournamentModel.transposeGroups = function(groups) {
    var transposed = [];

    groups.forEach(function(group) {
      group.forEach(function(teamid, index) {
        if (transposed[index] === undefined) {
          transposed[index] = [];
        }
        transposed[index].push(teamid);
      });
    });

    return transposed;
  };

  /**
   * Internal Function. creates a 2d array of groups for match creation
   *
   * @param ranking
   *          a RankingModel instance
   * @param mode
   *          one of the SwissTournamentModel.MODES
   * @return an array of arrays, where the inner array contains team ids which
   *         have the same rank, and outer array is ordered from best to worst
   *         rank
   */
  SwissTournamentModel.getSwissGroups = function(ranking, mode) {
    var allGroups, currentGroup, lastID, getID;

    /*
     * build different getIDs for different models
     */
    getID = undefined;
    switch (mode) {
    case SwissTournamentModel.MODES.all:
      getID = function(rankingid) {
        return 0;
      };
      break;
    case SwissTournamentModel.MODES.halves:
      getID = function(rankingid) {
        return rankingid < (ranking.displayOrder.length >> 1);
      };
      break;
    case SwissTournamentModel.MODES.wins:
      getID = function(rankingid) {
        return ranking.wins[rankingid];
      };
      break;
    case SwissTournamentModel.MODES.ranks:
      getID = function(rankingid) {
        return ranking.ranks[rankingid];
      };
      break;
    case SwissTournamentModel.MODES.individual:
      getID = function(rankingid) {
        return rankingid;
      };
      break;
    default:
      console.error('invalid mode');
      return undefined;
    }

    currentGroup = [];
    allGroups = [currentGroup];
    lastID = undefined;

    ranking.displayOrder.forEach(function(teamid, rankingid) {
      var id = getID(rankingid);
      if (id !== lastID) {
        lastID = id;
        if (currentGroup && currentGroup.length) {
          currentGroup = [];
          allGroups.push(currentGroup);
        }
      }
      currentGroup.push(teamid);
    });

    return allGroups;
  };

  /**
   * Internal Function
   *
   * in every rank group, randomize the team order
   *
   * @param rankGroups
   *          a getSwissGroups() result
   * @return a rankGroup 2d array where the order of the inner arrays is random
   */
  SwissTournamentModel.shuffleGroupTeams = function(rankGroups) {
    return rankGroups.map(function(group) {
      var newgroup;
      newgroup = [];

      while (group.length) {
        newgroup.push(rng.pickAndRemove(group));
      }

      return newgroup;
    });
  };

  /**
   * Internal Function.
   *
   * @param outMatches
   * @param outByes
   * @param rankGroups
   * @param gamematrix
   * @param byes
   * @param numTeams
   * @return true on success, false otherwise
   */
  SwissTournamentModel.traverseByes = function(outMatches, outByes, rankGroups,
      gamematrix, byes, numTeams) {
    var reverseRankGroups;

    if (numTeams % 2) {
      reverseRankGroups = rankGroups.slice(0).reverse();

      reverseRankGroups.some(function(group) {
        return group.slice(0).reverse().some(
            function(teamid) {
              var index;
              if (byes.get(teamid)) {
                return false;
              }

              index = group.indexOf(teamid);
              group.splice(index, 1);
              if (SwissTournamentModel.traverseAndBacktrack(outMatches,
                  rankGroups, gamematrix)) {
                outByes.push(teamid);
                return true;
              }

              group.splice(index, 0, teamid);

              return false;
            });
      });
    }

    return SwissTournamentModel.traverseAndBacktrack(outMatches, rankGroups,
        gamematrix);
  };

  /**
   * counts the number of teams remaining in the rank groups
   *
   * @param rankGroups
   *          a rankGroups object, as returned by getSwissGroups
   * @return the number of teams in the rank group
   */
  SwissTournamentModel.getSwissGroupsTeamCount = function(rankGroups) {
    var sum = 0;

    rankGroups.forEach(function(group) {
      sum += group.length;
    });

    return sum;
  };

  /**
   * @param outMatches
   * @param rankGroups
   * @param gamematrix
   * @return true on success, false otherwise
   */
  SwissTournamentModel.traverseAndBacktrack = function(outMatches, rankGroups,
      gamematrix) {
    var currentGroup, secondGroup, teamA, teamB, teamBindex;

    // console.log(getSwissGroupsTeamCount(rankGroups));
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

    if (SwissTournamentModel.traverseAndBacktrack(outMatches, rankGroups,
        gamematrix)) {
      // don't use push, because the best-ranked team should be listed in
      // the first match
      outMatches.unshift([teamA, teamB]);
      return true;
    }

    currentGroup.splice(teamBindex, 0, teamB);
    currentGroup.unshift(teamA);

    return false;
  };

  return SwissTournamentModel;
});
