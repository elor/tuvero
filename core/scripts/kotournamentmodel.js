/**
 * KOTournamentModel
 *
 * @return KOTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentmodel', 'backend/random', './type',
    './matchmodel', './byeresult'], function(extend, TournamentModel, Random,
    Type, MatchModel, ByeResult) {
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

      console.log(teams)

      if (teams[1] === undefined) {
        match = new ByeResult(teams[0], ['', ''], matchID, 0);
        this.history.push(match);
      } else {
        match = new MatchModel(teams, matchID, 0);
        this.matches.push(match);
      }

      matchID += 1;
    }

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
   * @param matchresult
   */
  KOTournamentModel.prototype.postprocessMatch = function(matchresult) {
    // TODO create the follow-up matches
  };

  /**
   *
   * @param length
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

  return KOTournamentModel;
});
