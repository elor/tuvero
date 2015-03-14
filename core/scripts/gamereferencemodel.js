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

  return GameReferenceModel;
});
