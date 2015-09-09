/**
 * KOTournamentModel
 *
 * @return KOTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './tournamentmodel', 'backend/random', './type'], //
function(extend, TournamentModel, Random, Type) {
  var rng = new Random();

  /**
   * Constructor
   */
  function KOTournamentModel() {
    KOTournamentModel.superconstructor.call(this, ['kowins']);

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
    var mode, indices, indexFunction;

    mode = this.getProperty('komode');
    indexFunction = KOTournamentModel[mode + 'Indices'];
    if (!Type.isFunction(indexFunction)) {
      this.emit('unknown KO mode: ' + mode);
      return false;
    }

    indices = indexFunction(this.teams.length);

    while (indices.length > 0) {
      if (indices[1] === undefined) {
        // bye
      } else {
        // match
      }
    }
  };

  KOTournamentModel.prototype.idleMatches = function() {
    throw new Error('KO Tournaments cannot be in idle state.'
        + ' This function can never be called by the TournamentModel.');
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
  KOTournamentModel.numMatchesInRound = function(round) {
    return firstMatchIDOfRound(round + 1) - firstMatchIDOfRound(round);
  };

  /**
   * @param matchID
   * @return the round of this match
   */
  KOTournamentModel.roundOfMatchID = function(matchID) {
    if (matchID === 0) {
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
    return groupID + roundOfMatchID(lostMatchID);
  };

  return KOTournamentModel;
});
