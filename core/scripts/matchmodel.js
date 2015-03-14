/**
 * MatchModel, a representation of a single match between teams
 *
 * @return MatchModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './matchresult'], function(extend, Model,
    GameResult) {
  /**
   * Constructor
   *
   * @param teams
   *          an array of team ids
   * @param id
   *          unique id of the match within its group
   * @param group
   *          identifier of the round, phase, pool, ...
   */
  function MatchModel(teams, id, group) {
    MatchModel.superconstructor.call(this);

    if (!teams || !teams.length) {
      console.error('MatchModel() no empty teams initialization allowed:');
      console.error(teams);
      throw Error('MatchModel: no empty initialization allowed!');
    }

    if (id === undefined) {
      console.warn('new MatchModel(): unique id within the group is required');
      throw Error('new MatchModel(): unique id within the group is required');
    }

    if (group === undefined) {
      console.warn('new MatchModel(): group is required');
      throw Error('new MatchModel(): group is required');
    }

    this.teams = teams.slice();
    this.length = this.teams.length;
    this.id = id;
    this.group = group;
  }
  extend(MatchModel, Model);

  MatchModel.prototype.EVENTS = {
    'finish': true
  };

  /**
   *
   * @param pos
   *          the teams position within the match
   * @return the team at position pos
   */
  MatchModel.prototype.getTeamID = function(pos) {
    /*
     * no additional check necessary. The array will return 'undefined' for us
     */
    // if (pos === undefined || pos < 0 || pos >= this.length) {
    // return undefined;
    // }
    return this.teams[pos];
  };

  /**
   * return the group of the match within the tournament
   *
   * @return the group of the match within the tournament
   */
  MatchModel.prototype.getGroup = function() {
    return this.group;
  };

  /**
   * return the match id within its group
   *
   * @return the match id within its group
   */
  MatchModel.prototype.getID = function() {
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
  MatchModel.prototype.finish = function(points) {
    var result;

    if (!points || points.length !== this.length) {
      console.error("MatchModel.finish(): lengths don't match");
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

  return MatchModel;
});
