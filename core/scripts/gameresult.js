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
   * @param players
   *          an array of player or team ids
   * @param points
   *          an array of scoredpoints
   */
  function GameResult(players, points) {
    if (players.length !== points.length) {
      throw new Error('GameResult(): array lengths differ: ' + players.length
          + '<>' + points.length);
    }
    this.players = players.slice(0);
    this.points = points.slice(0);
  }

  return GameResult;
});
