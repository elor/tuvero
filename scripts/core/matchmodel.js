/**
 * MatchModel, a representation of a single match between teams
 *
 * @return MatchModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "list/indexedmodel", "core/type"], function (extend,
    IndexedModel, Type) {
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

    if (teams === undefined) {
      teams = [];
    }
    if (group === undefined) {
      group = -1;
    }

    this.teams = teams.slice();
    this.length = this.teams.length;
    this.group = group;
  }
  extend(MatchModel, IndexedModel);

  MatchModel.prototype.EVENTS = {
    "update": true,
    "finish": true
  };

  /**
   *
   * @param pos
   *          the teams position within the match
   * @return the team at position pos
   */
  MatchModel.prototype.getTeamID = function (pos) {
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
  MatchModel.prototype.getGroup = function () {
    return this.group;
  };

  /**
   * If isResult() is false, `this.score` does not exist and this.finish() still
   * works.
   *
   * @return true if an inherited object is a MatchResult, false otherwise.
   */
  MatchModel.prototype.isResult = function () {
    return this.score !== undefined || !this.finish;
  };

  /**
   * @return true if this is not a result, all team IDs are unique and all team
   *         IDs are valid (not undefined). false otherwise.
   */
  MatchModel.prototype.isRunningMatch = function () {
    var valid;

    valid = true;

    if (valid) {
      valid = !this.isResult();
    }

    if (valid) {
      valid = this.teams.every(function (teamID) {
        return Type.isNumber(teamID);
      });
    }

    if (valid) {
      valid = this.teams.every(function (teamID, index) {
        return this.teams.slice(index + 1).indexOf(teamID) === -1;
      }, this);
    }

    return valid;
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
  MatchModel.prototype.finish = function (points) {
    var result, MatchResult;

    if (!points || points.length !== this.length) {
      console.error("MatchModel.finish(): lengths don't match");
      return undefined;
    }

    // Circular dependency. Require MatchResult directly
    MatchResult = require("core/matchresult");
    result = new MatchResult(this, points);

    this.emit("finish", result);

    return result;
  };

  /**
   * save the state into a data object
   *
   * @return a data object
   */
  MatchModel.prototype.save = function () {
    var data = MatchModel.superclass.save.call(this);

    data.g = this.group;
    data.t = this.teams.map(function (team) {
      if (team && team.getID) {
        return team.getID();
      } else if (team === undefined) {
        return -1;
      } else {
        return team;
      }
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
  MatchModel.prototype.restore = function (data) {
    if (!MatchModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.group = data.g;

    this.teams.splice(0);
    data.t.forEach(function (t) {
      this.teams.push(t === -1 ? undefined : t);
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
