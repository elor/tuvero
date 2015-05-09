/**
 * MatchModel, a representation of a single match between teams
 *
 * @return MatchModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedmodel', './matchresult'], function(extend,
    IndexedModel, MatchResult) {
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
    MatchModel.superconstructor.call(this, id);

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
  extend(MatchModel, IndexedModel);

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
   * disable setID() functionality
   */
  MatchModel.prototype.setID = undefined;

  /**
   * finishes a match with a certain result
   *
   * @param points
   *          An array of scored points for each team. Lengths have to match
   * @return a MatchResult instance representing the accepted result. undefined
   *         otherwise
   */
  MatchModel.prototype.finish = function(points) {
    var result;

    if (!points || points.length !== this.length) {
      console.error("MatchModel.finish(): lengths don't match");
      return undefined;
    }

    result = new MatchResult(this, points);

    this.emit('finish', result);

    return result;
  };

  /**
   * save the state into a data object
   *
   * @returns a data object
   */
  MatchModel.prototype.save = function() {
    var data = MatchModel.superclass.save.call(this);

    data.g = this.group;
    data.t = this.teams.map(function(team) {
      return team.getID ? team.getID() : team;
    });

    return data;
  };

  /**
   * restore from a saved state. Copies teams as Team IDs.
   *
   * @param data
   *          a saved state
   * @return true on success, false otherwise
   */
  MatchModel.prototype.restore = function(data) {
    if (!MatchModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.group = data.g;

    this.teams.splice(0);
    data.t.forEach(function(t) {
      this.teams.push(t);
    }, this);
    this.length = this.teams.length;

    return true;
  };

  MatchModel.prototype.SAVEFORMAT = Object
      .create(MatchModel.superclass.SAVEFORMAT);
  MatchModel.prototype.SAVEFORMAT.g = Number;
  MatchModel.prototype.SAVEFORMAT.t = [Number];

  return MatchModel;
});
