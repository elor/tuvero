/**
 * MatchResult, a simple match results class
 *
 * @return MatchResult
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './type', './matchmodel'], function(extend, Type,
    MatchModel) {
  /**
   * Constructor
   *
   * @param match
   *          a MatchModel instance of which the result is to be kept
   * @param score
   *          an array of scored points
   */
  function MatchResult(match, score) {
    MatchResult.superconstructor.call(this, match && match.teams, match
        && match.id, match && match.group);

    // empty default constructor for list-based construction
    if (score === undefined) {
      this.score = [];
      return;
    }

    if (this.teams.length !== score.length) {
      throw new Error('MatchResult(): array lengths differ: '
          + this.teams.length + '<>' + score.length);
    }

    this.score = score.slice(0);
  }
  extend(MatchResult, MatchModel);

  /**
   * Disable the finish() function
   */
  MatchResult.prototype.finish = undefined;

  /**
   * @return true if this result is a bye, false otherwise
   */
  MatchResult.prototype.isBye = function() {
    return this.length === 2 && this.getTeamID(0) === this.getTeamID(1);
  };

  /**
   * crude save function as if it was ripped right out of the Model class.
   *
   * @return a serializable data object on success, undefined otherwise
   */
  MatchResult.prototype.save = function() {
    var data = MatchResult.superclass.save.call(this);

    data.s = this.score;

    return data;
  };

  /**
   * restore from a serialized data object
   *
   * @param data
   *          the data object
   * @return true on success, false otherwise
   */
  MatchResult.prototype.restore = function(data) {
    if (!MatchResult.superclass.restore.call(this, data)) {
      return false;
    }

    this.score = data.s;

    return true;
  };

  MatchResult.prototype.SAVEFORMAT = Object
      .create(MatchModel.superclass.SAVEFORMAT);
  MatchResult.prototype.SAVEFORMAT.s = [Number];

  return MatchResult;
});
