/**
 * KOTournamentModel
 *
 * @return KOTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentmodel', 'backend/random', './type',
    './matchmodel', './byeresult', 'options'], function(extend,
    TournamentModel, Random, Type, MatchModel, ByeResult, Options) {
  var rng = new Random();

  /**
   * Constructor
   */
  function KOTournamentModel() {
    KOTournamentModel.superconstructor.call(this, ['wins']);

    this.setProperty('komode', 'matched');
  }
  extend(KOTournamentModel, TournamentModel);

  KOTournamentModel.prototype.SYSTEM = 'ko';

  KOTournamentModel.MODES = {
    ordered: 'ordered',
    matched: 'matched',
    shuffled: 'shuffled'
  };

  /**
   * create the initial matches for the registered teams
   *
   * @return true on success, false otherwise
   */
  KOTournamentModel.prototype.initialMatches = function() {
    var mode, indices, indexFunction, matchID, roundID, match, teams;

    mode = this.getProperty('komode');
    indexFunction = KOTournamentModel[mode + 'Indices'];
    if (!Type.isFunction(indexFunction)) {
      this.emit('error', 'unknown KO mode: ' + mode);
      return false;
    }

    indices = indexFunction(this.teams.length);

    roundID = KOTournamentModel.initialRoundForTeams(this.teams.length);
    if (roundID < 0) {
      this.emit('error', 'not enough players for KO tournament');
      return false;
    }
    matchID = KOTournamentModel.firstMatchIDOfRound(roundID);

    while (indices.length > 0) {
      teams = indices.splice(0, 2);

      if (teams[1] === undefined) {
        match = new ByeResult(teams[0], [Options.byepointswon,
            Options.byepointslost], matchID, 0);
        this.history.push(match);
      } else {
        match = new MatchModel(teams, matchID, 0);
        this.matches.push(match);
      }

      matchID += 1;
    }

    this.history.map(function(match) {
      if (match.isBye()) {
        this.checkForFollowupMatches(match);
      }
    }, this);

    // this.createPlaceholderMatches();

    return true;
  };

  /**
   * should never be called since KO tournaments can't be idle, only finished
   */
  KOTournamentModel.prototype.idleMatches = function() {
    throw new Error('KO Tournaments cannot be in idle state.'
        + ' This function can never be called by the TournamentModel.');
  };

  /**
   * create subsequent matches in the KO tree
   *
   * @param matchresult
   */
  KOTournamentModel.prototype.postprocessMatch = function(matchresult) {
    this.checkForFollowupMatches(matchresult);

    if (this.matches.length === 0) {
      this.state.set('finished');
    }
  };

  /**
   * search the current matches for the required match
   *
   * @param group
   *          the match group
   * @param id
   *          the match id
   * @return the match (MatchModel) on success, undefined otherwise
   */
  KOTournamentModel.prototype.findMatch = function(group, id) {
    var index, match;

    for (index = 0; index < this.matches.length; index += 1) {
      match = this.matches.get(index);

      if (match.getID() === id && match.getGroup() === group) {
        return match;
      }
    }

    return undefined;
  };

  /**
   * find a match in the history
   *
   * @param group
   *          the match group
   * @param id
   *          the match id
   * @return the match on success (MatchResult or ByeResult), undefined
   *         otherwise
   */
  KOTournamentModel.prototype.findMatchInHistory = function(group, id) {
    var index, match;

    for (index = 0; index < this.history.length; index += 1) {
      match = this.history.get(index);

      if (match.getID() === id && match.getGroup() === group) {
        return match;
      }
    }

    return undefined;
  };

  /**
   * create all placeholder matches
   */
  KOTournamentModel.prototype.createPlaceholderMatches = function() {
    var groups, groupMatchIDLimit, losergroup, id;

    groups = [];
    while (groups.length * 2 < this.teams.length) {
      groups.push(groups.length);
    }

    groupMatchIDLimit = groups.map(function(groupID) {
      return KOTournamentModel.firstMatchIDOfRound(KOTournamentModel
          .roundsInGroup(group));
    });

    id = KOTournamentModel.firstMatchIDOfRound(KOTournamentModel
        .initialRoundForTeams(this.teams)) - 1;
    for (; id > 0; id -= 1) {
      groupMatchIDLimit.forEach(function(matchIDLimit, group) {
        if (id < matchIDLimit) {
          this.matches.push(new MatchModel([undefined, undefined], id, group));
        }
      }, this);
    }
  };

  /**
   * after a match has been finished or a bye has been issued, this function
   * checks for possible subsequent matches and create them
   *
   * @param result
   *          a MatchResult (or MatchModel or ByeResult)
   */
  KOTournamentModel.prototype.checkForFollowupMatches = function(result) {
    var currentMatchID, nextMatchID, winnergroup, losergroup, winner, loser;

    currentMatchID = result.getID();
    if (currentMatchID === 0) {
      // don't advance beyond the finale
      return;
    }

    // calculate the IDs
    nextMatchID = KOTournamentModel.nextRoundMatchID(currentMatchID);
    winnergroup = result.getGroup();
    losergroup = KOTournamentModel.loserGroupID(winnergroup, currentMatchID);

    // get winners
    if (result.isBye()) {
      winner = result.getTeamID(0);
      loser = undefined;
    } else {
      if (result.score[0] < result.score[1]) {
        winner = result.getTeamID(1);
        loser = result.getTeamID(0);
      } else {
        winner = result.getTeamID(0);
        loser = result.getTeamID(1);
      }
    }

    // create matches
    this.createFollowupMatch(winner, nextMatchID, winnergroup, result);
    this.createFollowupMatch(loser, nextMatchID, losergroup, result);
  };

  /**
   * create a followup match, i.e. a match to which a team from a previous match
   * is assigned
   *
   * @param teamID
   *          the ID of the team which advanced to this round
   * @param nextMatchID
   *          the ID of the next match
   * @param nextGroupID
   *          the group of the next match
   * @param currentMatch
   *          the current match, which has just ended
   */
  KOTournamentModel.prototype.createFollowupMatch = function(teamID,
      nextMatchID, nextGroupID, currentMatch) {
    var opponent, match, complementaryMatchID, currentMatchID, currentGroupID;

    currentMatchID = currentMatch.getID();
    currentGroupID = currentMatch.getGroup();

    if (currentMatchID <= 1) {
      return;
    }

    if (teamID !== undefined) {
      match = this.findMatch(nextGroupID, nextMatchID);

      if (match) {
        opponent = match.getTeamID(0);
        if (opponent === undefined) {
          opponent = match.getTeamID(1);
        }
        this.matches.remove(this.matches.indexOf(match));
        teams = [teamID, opponent];
        if (KOTournamentModel.isSecondInNextRound(currentMatchID)) {
          teams.reverse();
        }
        match = new MatchModel(teams, nextMatchID, nextGroupID);
        this.matches.push(match);
        // if (opponent === undefined && nextMatchID !== 0) {
        // this.checkForFollowupMatches(match);
        // }
      } else {
        complementaryMatchID = KOTournamentModel
            .complementaryMatchID(currentMatchID);
        complementaryMatchGroup = currentGroupID;

        match = this.findMatch(currentGroupID, complementaryMatchID);
        if (!match) {
          match = this.findMatchInHistory(currentGroupID, //
          complementaryMatchID);
        }

        if ((match && match.isResult() && match.isBye())) {
          match = new ByeResult(teamID, [Options.byepointswon,
              Options.byepointslost], nextMatchID, nextGroupID);
          this.history.push(match);
          this.checkForFollowupMatches(match);
        } else {
          match = new MatchModel([teamID, undefined], nextMatchID, //
          nextGroupID);
          this.matches.push(match);
        }
      }
    }
  };

  /**
   * @param length
   *          the number of teams
   * @return an array of team indices for a matched tournament
   */
  KOTournamentModel.matchedIndices = function(length) {
    var indices, index, value, length2;

    if (length === 1) {
      indices = [0];
    } else if (length > 1) {
      length2 = KOTournamentModel.ceilPowerOfTwo(length);
      indices = KOTournamentModel.matchedIndices(length2 >> 1);

      for (index = indices.length - 1; index >= 0; index -= 1) {
        value = indices[index];
        value = length2 - value - 1;
        if (value >= length) {
          value = undefined;
        }
        indices.splice(index + 1, 0, value);
      }
    } else {
      indices = [];
    }

    return indices;
  };

  /**
   * @param length
   *          the number of teams
   * @return an array of teamIDs and 'undefined' values which give a matching
   *         for the init function
   */
  KOTournamentModel.orderedIndices = function(length) {
    var indices, length2, index;

    length2 = KOTournamentModel.ceilPowerOfTwo(length);

    indices = [];
    while (indices.length < length) {
      indices.push(indices.length);
    }

    for (index = indices.length; indices.length < length2; index -= 1) {
      indices.splice(index, 0, undefined);
    }

    return indices;
  };

  /**
   *
   * @param length
   *          the number of teams
   * @return an array of teamIDs and placeholders for the initial set of ko
   *         matches
   */
  KOTournamentModel.randomIndices = function(length) {
    var indices, length2, index, teamids;

    length2 = KOTournamentModel.ceilPowerOfTwo(length);

    teamids = [];
    while (teamids.length < length) {
      teamids.push(teamids.length);
    }

    indices = [];
    while (teamids.length > 0) {
      indices.push(rng.pickAndRemove(teamids));
    }

    for (index = indices.length; indices.length < length2; index -= 1) {
      indices.splice(index, 0, undefined);
    }

    return indices;
  };

  /**
   * @param number
   * @return the ceiling-rounded number, to the power of two
   */
  KOTournamentModel.ceilPowerOfTwo = function(number) {
    return 1 << Math.ceil(Math.log(number) / Math.LN2);
  };

  /**
   * @param currentMatchID
   *          match ID
   * @return the next match ID the teams will play
   */
  KOTournamentModel.nextRoundMatchID = function(currentMatchID) {
    return currentMatchID >> 1;
  };

  /**
   * @param matchID
   *          the match ID
   * @return true if the teams of this match will be the second player of their
   *         next match, false otherwise
   */
  KOTournamentModel.isSecondInNextRound = function(matchID) {
    return matchID % 2 === 1 && matchID !== 1;
  };

  /**
   * @param matchID
   *          a match ID
   * @return the ID of the match from which the next opponents are drawn
   */
  KOTournamentModel.complementaryMatchID = function(matchID) {
    return matchID ^ 0x1;
  };

  /**
   * @param round
   *          the round ID
   * @return the ID of the first match in the round
   */
  KOTournamentModel.firstMatchIDOfRound = function(round) {
    return 1 << round;
  };

  /**
   * @param round
   *          the round ID
   * @return the number of matches in this round
   */
  // coincidentally, the two functions are the same
  KOTournamentModel.numMatchesInRound = KOTournamentModel.firstMatchIDOfRound;

  /**
   * @param matchID
   * @return the round of this match
   */
  KOTournamentModel.roundOfMatchID = function(matchID) {
    if (matchID <= 0) {
      matchID = 1;
    }
    return Math.floor(Math.log(matchID) / Math.LN2);
  };

  /**
   * @param groupID
   *          the current group ID
   * @param lostMatchID
   *          the ID of the just lost match
   * @return the next group ID
   */
  KOTournamentModel.loserGroupID = function(groupID, lostMatchID) {
    return groupID + KOTournamentModel.roundOfMatchID(lostMatchID);
  };

  /**
   * @param group
   *          a group ID
   * @return the parent group ID, i.e. where the matches come from
   */
  KOTournamentModel.parentGroup = function(group) {
    if (group === 0) {
      return 0;
    }

    return group - (1 << (KOTournamentModel.roundsInGroup(group) - 1));
  };

  /**
   * @param numTeams
   *          number of Teams
   * @return the initial round ID for the given number of teams
   */
  KOTournamentModel.initialRoundForTeams = function(numTeams) {
    if (numTeams <= 0) {
      numTeams = 1;
    }
    return Math.ceil(Math.log(numTeams) / Math.LN2) - 1;
  };

  /**
   * @param group
   *          the id of the group
   * @return the number of rounds which are played exclusively in this group
   */
  KOTournamentModel.roundsInGroup = function(group) {
    var rounds;

    if (group === 0) {
      return 32;
    }

    for (rounds = 0; rounds < 32; rounds += 1) {
      if ((group & (1 << rounds)) !== 0) {
        break;
      }
    }

    return rounds + 1;
  };

  return KOTournamentModel;
});
