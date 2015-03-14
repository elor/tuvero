/**
 * GameResult, a simple game results class
 *
 * @return GameResult
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  /**
   * Constructor
   *
   * @param teams
   *          an array of team or team ids
   * @param score
   *          an array of scored points
   */
  function GameResult(teams, score) {
    if (teams.length !== score.length) {
      throw new Error('GameResult(): array lengths differ: ' + teams.length
          + '<>' + score.length);
    }
    this.teams = teams.slice(0);
    this.score = score.slice(0);
  }

  return GameResult;
});
