/**
 * SwissTournamentModel
 *
 * @return SwissTournamentModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "tournament/roundtournamentmodel", "core/random", "core/matchmodel",
    "core/byeresult", "options", "presets"], function (extend,
    RoundTournamentModel, Random, MatchModel, ByeResult, Options, Presets) {
  var rng = new Random();
  /**
   * Constructor
   *
   * @param rankingorder
   */
  function SwissTournamentModel(rankingorder) {
    SwissTournamentModel.superconstructor.call(this, rankingorder);

    this.setProperty("swissmode",
        (Presets.systems.swiss && Presets.systems.swiss.mode)
            || SwissTournamentModel.MODES.ranks);
    this.setProperty("swissshuffle", true);
    this.setProperty("swisstranspose", false);

    this.setProperty("byeafterbye", false);
    this.setProperty("byeafterup", true);
    this.setProperty("byeafterdown", true);

    this.setProperty("upafterbye", true);
    this.setProperty("upafterup", false);
    this.setProperty("upafterdown", true);

    this.setProperty("downafterbye", true);
    this.setProperty("downafterup", true);
    this.setProperty("downafterdown", false);

    this.setProperty("enableupdown", this.getProperty("swissmode") === "wins");
  }
  extend(SwissTournamentModel, RoundTournamentModel);

  SwissTournamentModel.prototype.SYSTEM = "swiss";

  SwissTournamentModel.prototype.RANKINGDEPENDENCIES = ["votes", "gamematrix"];

  /**
   * an array of required vote lists
   */
  SwissTournamentModel.prototype.VOTES = ["bye", "up", "down"];

  SwissTournamentModel.MODES = {
    all: "all",
    halves: "halves",
    ranks: "ranks",
    wins: "wins",
    individual: "individual",
    // TODO enable the use of global team ids (rangliste, elo, ...)
    globalteamid: undefined
  };

  /**
   * creates new matches depending on the current ranking within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.idleMatches = function () {
    var rankGroups, matches, votes, mode;

    /*
     * validate swiss mode
     */
    mode = this.getProperty("swissmode");

    if (SwissTournamentModel.MODES[mode] === undefined) {
      this.emit("error", "invalid mode: " + mode);
      return false;
    }

    rankGroups = SwissTournamentModel.getGroups(this.ranking.get(), mode);

    /*
     * shuffle if wanted
     */
    if (this.getProperty("swissshuffle") === true) {
      rankGroups = SwissTournamentModel.shuffleGroupTeams(rankGroups);
    }

    /*
     * transpose if wanted
     */
    if (this.getProperty("swisstranspose") === true) {
      rankGroups = SwissTournamentModel.transposeGroups(rankGroups);
    }

    /*
     * use awesome algorithm to find an allowed solution
     */
    matches = [];
    votes = {};
    if (!this.findSwissByesAndMatches(matches, votes, rankGroups)) {
      this.emit("error", "cannot find unique byes and matches");
      return false;
    }

    /*
     * advance the round index
     */
    this.round += 1;

    votes.ups.forEach(function (upTeamID) {
      this.votes.up.push(upTeamID);
      this.ranking.upvotes
          .set(upTeamID, this.ranking.upvotes.get(upTeamID) + 1);
    }, this);

    votes.downs.forEach(function (upTeamID) {
      this.votes.down.push(upTeamID);
      this.ranking.downvotes.set(upTeamID,
          this.ranking.downvotes.get(upTeamID) + 1);
    }, this);

    /*
     * add the byes and matches to the current tournament
     */
    votes.byes.forEach(function (byeTeamID, byeIndex) {
      this.addBye(byeTeamID, matches.length + byeIndex, this.round);
    }, this);

    matches.forEach(function (matchTeams, matchid) {
      this.matches.push(new MatchModel(matchTeams, matchid, this.round));
    }, this);

    this.ranking.invalidate();

    return true;
  };

  /**
   * creates new matches depending on the initial within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.initialMatches = function () {
    this.correctWinGroupRankingOrder();
    return this.idleMatches();
  };

  SwissTournamentModel.prototype.correctWinGroupRankingOrder = function () {
    var components, windex;

    components = this.ranking.componentnames;

    if (this.getProperty("swissmode") === "wins" && components[0] !== "wins") {
      windex = components.indexOf("wins");

      if (windex !== -1) {
        components.splice(windex, 1);
      }

      components.unshift("wins");

      this.setRankingOrder(components);
    }
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
  SwissTournamentModel.transposeGroups = function (groups) {
    var transposed = [];

    groups.forEach(function (group) {
      group.forEach(function (teamid, index) {
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
  SwissTournamentModel.getGroups = function (ranking, mode) {
    var allGroups, currentGroup, lastID, getID;

    /*
     * build different getIDs for different models
     */
    getID = undefined;
    switch (mode) {
    case SwissTournamentModel.MODES.all:
      getID = function (rankingid) {
        return 0;
      };
      break;
    case SwissTournamentModel.MODES.halves:
      getID = function (rankingid) {
        return rankingid < (ranking.displayOrder.length >> 1);
      };
      break;
    case SwissTournamentModel.MODES.wins:
      getID = function (rankingid) {
        return ranking.wins[ranking.displayOrder[rankingid]];
      };
      break;
    case SwissTournamentModel.MODES.ranks:
      getID = function (rankingid) {
        return ranking.ranks[rankingid];
      };
      break;
    case SwissTournamentModel.MODES.individual:
      getID = function (rankingid) {
        return rankingid;
      };
      break;
    default:
      console.error("invalid mode");
      return undefined;
    }

    currentGroup = [];
    allGroups = [currentGroup];
    lastID = undefined;

    ranking.displayOrder.forEach(function (teamid, rankingid) {
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
   *          a getGroups() result
   * @return a rankGroup 2d array where the order of the inner arrays is random
   */
  SwissTournamentModel.shuffleGroupTeams = function (rankGroups) {
    return rankGroups.map(function (group) {
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
   * Find a valid bye if necessary, and a valid match for every team in the
   * rankGroups list
   *
   * @param outMatches
   *          an array into which the matches are written (int[][2])
   * @param outVotes
   *          an empty object. The vote output arrays are written here
   * @param rankGroups
   *          a 2d groups array
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.findSwissByesAndMatches = function (outMatches,
      outVotes, rankGroups) {
    var reverseRankGroups;

    outVotes.byes = [];
    outVotes.ups = [];
    outVotes.downs = [];

    if (SwissTournamentModel.getGroupsTeamCount(rankGroups) % 2) {
      reverseRankGroups = rankGroups.slice(0).reverse();

      if (!reverseRankGroups.some(function (group) {
        return group.slice(0).reverse().some(function (teamid) {
          var index;
          if (!this.canGetBye(teamid)) {
            return false;
          }

          index = group.indexOf(teamid);
          group.splice(index, 1);

          if (this.prefilterSwissMatches(rankGroups)) {
            if (this.findSwissMatches(outMatches, outVotes, rankGroups)) {
              outVotes.byes.push(teamid);
              return true;
            }
          }

          group.splice(index, 0, teamid);

          return false;
        }, this);
      }, this)) {
        return false;
      }
    }

    if (this.findSwissMatches(outMatches, outVotes, rankGroups)) {
      return true;
    }

    return false;
  };

  /**
   * counts the number of teams remaining in the rank groups
   *
   * @param rankGroups
   *          a rankGroups object, as returned by getGroups
   * @return the number of teams in the rank group
   */
  SwissTournamentModel.getGroupsTeamCount = function (rankGroups) {
    var sum = 0;

    rankGroups.forEach(function (group) {
      sum += group.length;
    });

    return sum;
  };

  /**
   * quick-check whether the up/downvotes can be applied. This is not a complete
   * test, it just checks for obvious errors (are there any upvotes/downvotes in
   * the group?)
   *
   * @param rankGroups
   *          a 2D array of rank groups
   * @return true if there's no obvious error, false otherwise
   */
  SwissTournamentModel.prototype.prefilterSwissMatches = function (rankGroups) {
    var downvote = false;

    // verify up/downvotes
    if (this.getProperty("enableupdown")) {
      if (!rankGroups.every(function (group) {
        var teams = group.length;
        if (downvote) {
          // upvote required
          if (!group.some(this.canGetUpvote.bind(this))) {
            return false;
          }

          downvote = false;
          teams -= 1;
        }

        if (teams % 2 !== 0) {
          // downvote required
          if (!group.some(this.canGetDownvote.bind(this))) {
            return false;
          }
          downvote = true;
        }

        return true;
      }, this)) {
        return false;
      }
    }

    return true;
  };

  /**
   * @param outMatches
   *          Output. An array into which the matches are written.
   * @param outVotes
   *          Output. A pre-initialized object of arrays into which the votes
   *          are written for output.
   * @param rankGroups
   *          The rank groups.
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.findSwissMatches = function (outMatches,
      outVotes, rankGroups) {
    var currentGroup, teamA, teamB, updown;

    // console.log(getGroupsTeamCount(rankGroups));
    // console.log(JSON.stringify(rankGroups));

    currentGroup = undefined;

    // get firstGroupIndex by searching for the first non-empty group
    if (!rankGroups.some(function (group) {
      currentGroup = group;
      return group.length > 0;
    })) {
      // success! there's no team left
      return true;
    }

    // verify eventual downvote
    if (currentGroup.length === 1 && this.getProperty("enableupdown")) {
      if (!this.canGetDownvote(currentGroup[0])) {
        return false;
      }
    }

    teamA = currentGroup.shift();
    teamB = undefined;
    updown = false; // whether the next non-empty group has already been tried

    // try to find a match in any subsequent group, or just this or the one
    // after.
    if (rankGroups.some(function (group) {
      if (group.length === 0) {
        return false;
      }

      if (this.getProperty("enableupdown")) {
        if (updown) {
          return false;
        }

        if (group !== currentGroup) {
          updown = true;
        }
      }

      return group.some(function (team, index) {
        var secondGroup, teamBindex;

        if (this.canPlayMatch(teamA, team, updown)) {
          secondGroup = group;
          teamB = team;
          teamBindex = index;

          if (updown) {
            outVotes.downs.push(teamA);
            outVotes.ups.push(teamB);
          }
          secondGroup.splice(teamBindex, 1);

          if (this.findSwissMatches(outMatches, outVotes, rankGroups)) {
            return true;
          }

          secondGroup.splice(teamBindex, 0, teamB);
          if (updown) {
            outVotes.downs.pop();
            outVotes.ups.pop();
          }
        }
        return false;
      }, this);
    }, this)) {
      // don't use push, because the best-ranked team should be listed in
      // the first match
      outMatches.unshift([teamA, teamB]);
      return true;
    }

    currentGroup.unshift(teamA);

    return false;
  };

  /**
   * @param teamid
   *          the id of the team
   * @return true if the team already has a bye
   */
  SwissTournamentModel.prototype.hasBye = function (teamid) {
    return this.ranking.byes.get(teamid) !== 0;
  };

  /**
   * @param teamid
   *          the id of the team
   * @return true if the team already has an upvote
   */
  SwissTournamentModel.prototype.hasUpvote = function (teamid) {
    return this.ranking.upvotes.get(teamid) !== 0;
  };

  /**
   * @param teamid
   *          the id of the team
   * @return true if the team already has a downvote
   */
  SwissTournamentModel.prototype.hasDownvote = function (teamid) {
    return this.ranking.downvotes.get(teamid) !== 0;
  };

  /**
   * checks all conditions and returns true if a bye can be issued
   *
   * @param teamid
   *          the prospective team id
   * @return true if the bye would be valid, false otherwise
   */
  SwissTournamentModel.prototype.canGetBye = function (teamid) {
    if (!this.getProperty("byeafterbye") && this.hasBye(teamid)) {
      return false;
    }

    if (!this.getProperty("byeafterup") && this.hasUpvote(teamid)) {
      return false;
    }

    if (!this.getProperty("byeafterdown") && this.hasDownvote(teamid)) {
      return false;
    }

    return true;
  };

  /**
   * checks all upvote conditions and returns true if an upvote is allowed
   *
   * @param teamid
   *          the prospective team id
   * @return true if the upvote is allowed, false otherwise
   */
  SwissTournamentModel.prototype.canGetUpvote = function (teamid) {
    if (!this.getProperty("upafterup") && this.hasUpvote(teamid)) {
      return false;
    }

    if (!this.getProperty("upafterbye") && this.hasBye(teamid)) {
      return false;
    }

    if (!this.getProperty("upafterdown") && this.hasDownvote(teamid)) {
      return false;
    }

    return true;
  };

  /**
   * checks all downvote conditions and returns true if a downvote is allowed
   *
   * @param teamid
   *          the prospective team id
   * @return true if the downvote is allowed, false otherwise
   */
  SwissTournamentModel.prototype.canGetDownvote = function (teamid) {
    if (!this.getProperty("downafterdown") && this.hasDownvote(teamid)) {
      return false;
    }

    if (!this.getProperty("downafterbye") && this.hasBye(teamid)) {
      return false;
    }

    if (!this.getProperty("downafterup") && this.hasUpvote(teamid)) {
      return false;
    }

    return true;
  };

  /**
   * @param teamA
   *          index of team A
   * @param teamB
   *          index of team B
   * @param updown
   *          if true, teamA is checked for downvotes and teamB for downvotes
   * @return true if they can play a match, false otherwise
   */
  SwissTournamentModel.prototype.canPlayMatch = function (teamA, teamB, updown) {
    if (this.ranking.gamematrix.get(teamA, teamB) !== 0) {
      return false;
    }

    if (updown) {
      if (!this.canGetDownvote(teamA) || !this.canGetUpvote(teamB)) {
        return false;
      }
    }

    return true;
  };

  return SwissTournamentModel;
});
