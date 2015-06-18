/**
 * MatchResult, a simple game results class
 *
 * @return MatchResult
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./type', './model'], function(Type, Model) {
  /**
   * Constructor
   *
   * @param teams
   *          an array of team or team ids OR a MatchModel object
   * @param score
   *          an array of scored points
   */
  function MatchResult(teams, score) {
    // empty default constructor for list-based construction
    if (teams === undefined && score === undefined) {
      this.match = undefined;
      this.teams = [];
      this.score = [];
      return;
    }

    if (Type.isObject(teams) && Type.isArray(teams.teams)) {
      // teams is a match object. Keep the reference.
      this.match = teams;
      teams = teams.teams;
    } else {
      this.match = undefined;
    }

    if (!Type.isArray(teams)) {
      throw new Error('MatchResult():'
          + 'teams is neither an array nor a MatchModel instance');
    }

    if (teams.length !== score.length) {
      throw new Error('MatchResult(): array lengths differ: ' + teams.length
          + '<>' + score.length);
    }

    this.teams = teams.slice(0);
    this.score = score.slice(0);
  }

  /**
   * crude save function as if it was ripped right out of the Model class.
   *
   * @return a serializable data object on success, undefined otherwise
   */
  MatchResult.prototype.save = function() {
    return {
      t: this.teams,
      s: this.score
    };
  };

  /**
   * restore from a serialized data object
   *
   * @param data
   *          the data object
   * @return true on success, false otherwise
   */
  MatchResult.prototype.restore = function(data) {
    if (!Model.prototype.restore.call(this, data)) {
      return false;
    }

    this.match = undefined;
    this.teams = data.t;
    this.score = data.s;

    return true;
  };

  MatchResult.prototype.SAVEFORMAT = {};
  MatchResult.prototype.SAVEFORMAT.t = [Number];
  MatchResult.prototype.SAVEFORMAT.s = [Number];

  return MatchResult;
});
