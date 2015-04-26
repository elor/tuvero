/**
 * MatchResult, a simple game results class
 *
 * @return MatchResult
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./type'], function(Type) {
  /**
   * Constructor
   *
   * @param teams
   *          an array of team or team ids OR a MatchModel object
   * @param score
   *          an array of scored points
   */
  function MatchResult(teams, score) {
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

  return MatchResult;
});
