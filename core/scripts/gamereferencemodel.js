/**
 * GameReferenceModel: Reference a game in all regards, but map the teams from
 * their tournament-specific id to the global id.
 *
 * @return GameReferenceModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './gamemodel'], function(extend, GameModel) {
  /**
   * Constructor
   *
   * @param game
   *          a valid game to reference
   * @param teamlist
   *          a list of teams which maps an internal id (index within the
   *          tournament) the the external id (global team id)
   */
  function GameReferenceModel(game, teamlist) {
    var teams = game.teams.map(function(teamid) {
      return teamlist.get(teamid);
    });
    GameReferenceModel.superconstructor.call(this, teams, game.id, game.group);

    this.game = game;
    game.registerListener(this);
  }
  extend(GameReferenceModel, GameModel);

  /**
   * forward the finish()-call to the referenced game
   *
   * @param score
   *          an array of points for each team. Lengths have to match!
   * @return true on success, undefined otherwise
   */
  GameReferenceModel.prototype.finish = function(score) {
    if (this.game.finish(score) === undefined) {
      return undefined;
    }
    return true;
  };

  /**
   * Forward the "finish"-event to notify listeners about a finished game
   *
   * The re-emitted event does not contain the result of the game, which is to
   * be processed at the lowest level, i.e. within the tournament.
   *
   * This function also unregisters from the game itself to avoid memory leaks.
   * The current specification disallows any events after 'finish'.
   */
  GameReferenceModel.prototype.onfinish = function() {
    this.game.unregisterListener(this);
    this.emit('finish');
  };

  return GameReferenceModel;
});
