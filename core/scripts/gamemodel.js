/**
 * GameModel, a representation of a single match between teams
 *
 * @return GameModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './gameresult'], function(extend, Model,
    GameResult) {
  /**
   * Constructor
   *
   * @param teams
   *          an array of team ids
   * @param id
   *          unique id of the game within its group
   * @param group
   *          identifier of the round, phase, pool, ...
   */
  function GameModel(teams, id, group) {
    GameModel.superconstructor.call(this);

    if (!teams || !teams.length) {
      console.error('GameModel() no empty teams initialization allowed:');
      console.error(teams);
      throw Error('GameModel: no empty initialization allowed!');
    }

    if (id === undefined) {
      console.warn('new GameModel(): unique id within the group is required');
      throw Error('new GameModel(): unique id within the group is required');
    }

    if (group === undefined) {
      console.warn('new GameModel(): group is required');
      throw Error('new GameModel(): group is required');
    }

    this.teams = teams.slice();
    this.length = this.teams.length;
    this.id = id;
    this.group = group;
  }
  extend(GameModel, Model);

  GameModel.prototype.EVENTS = {
    'finish': true
  };

  /**
   *
   * @param pos
   *          the teams position within the game
   * @return the team at position pos
   */
  GameModel.prototype.getTeamID = function(pos) {
    /*
     * no additional check necessary. The array will return 'undefined' for us
     */
    // if (pos === undefined || pos < 0 || pos >= this.length) {
    // return undefined;
    // }
    return this.teams[pos];
  };

  /**
   * return the group of the game within the tournament
   *
   * @return the group of the game within the tournament
   */
  GameModel.prototype.getGroup = function() {
    return this.group;
  };

  /**
   * return the game id within its group
   *
   * @return the game id within its group
   */
  GameModel.prototype.getID = function() {
    return this.id;
  };

  /**
   * finishes a match with a certain result
   *
   * @param points
   *          An array of scored points for each team. Lengths have to match
   * @return a GameResult instance representing the accepted result. undefined
   *         otherwise
   */
  GameModel.prototype.finish = function(points) {
    var result;

    if (!points || points.length !== this.length) {
      console.error("GameModel.finish(): lengths don't match");
      return undefined;
    }
    if (this.finished) {
      console.error('the match has already been finished');
      return undefined;
    }

    result = new GameResult(this.teams, points);
    this.finished = true;

    this.emit('finish', result);

    return result;
  };

  return GameModel;
});
