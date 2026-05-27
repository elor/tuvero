import IndexedModel from '../list/indexedmodel.js'
import Type from './type.js'

// Populated by matchresult.js after it extends MatchModel, breaking the circular import cycle
let _MatchResult = null
export function _registerMatchResult (cls) {
  _MatchResult = cls
}

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
class MatchModel extends IndexedModel {
  constructor (teams, id, group, place) {
    super(id)
    if (teams === undefined) {
      teams = []
    }
    if (group === undefined) {
      group = -1
    }
    this.teams = teams.slice()
    this.length = this.teams.length
    this.group = group
    this.place = place || ''
  }

  /**
   *
   * @param pos
   *          the teams position within the match
   * @return the team at position pos
   */
  getTeamID (pos) {
    /*
     * no additional check necessary. The array will return 'undefined' for us
     */
    // if (pos === undefined || pos < 0 || pos >= this.length) {
    // return undefined;
    // }
    return this.teams[pos]
  }

  /**
   * return the group of the match within the tournament
   *
   * @return the group of the match within the tournament
   */
  getGroup () {
    return this.group
  }

  setPlace (place) {
    place = place || ''
    if (place !== this.place) {
      this.place = place
      this.emit('update')
    }
  }

  /**
   * If isResult() is false, `this.score` does not exist and this.finish() still
   * works.
   *
   * @return true if an inherited object is a MatchResult, false otherwise.
   */
  isResult () {
    return this.score !== undefined || !this.finish
  }

  /**
   * @return true if this is not a result, all team IDs are unique and all team
   *         IDs are valid (not undefined). false otherwise.
   */
  isRunningMatch () {
    let valid
    valid = true
    if (valid) {
      valid = !this.isResult()
    }
    if (valid) {
      valid = this.teams.every(function (teamID) {
        return Type.isNumber(teamID)
      })
    }
    if (valid) {
      valid = this.teams.every(function (teamID, index) {
        return this.teams.slice(index + 1).indexOf(teamID) === -1
      }, this)
    }
    return valid
  }

  /**
   * finishes a match with a certain result
   *
   * @param points
   *          An array of scored points for each team. Lengths have to match
   * @return a MatchResult instance representing the accepted result. undefined
   *         otherwise
   */
  finish (points) {
        if (!points || points.length !== this.length) {
      console.error("MatchModel.finish(): lengths don't match")
      return undefined
    }

    const result = new _MatchResult(this, points)
    this.emit('finish', result)
    return result
  }

  /**
   * save the state into a data object
   *
   * @return a data object
   */
  save () {
    const data = super.save()
    data.g = this.group
    data.t = this.teams.map(function (team) {
      if (team && team.getID) {
        return team.getID()
      } else if (team === undefined) {
        return -1
      } else {
        return team
      }
    })
    data.place = this.place
    return data
  }

  /**
   * restore from a saved state. Copies teams as Team IDs.
   *
   * @param data
   *          a saved state
   * @return true on success, false otherwise
   */
  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.group = data.g
    this.teams.splice(0)
    data.t.forEach(function (t) {
      this.teams.push(t === -1 ? undefined : t)
    }, this)
    this.length = this.teams.length
    if (data.place) {
      this.place = data.place
    }
    return true
  }
}

MatchModel.prototype.EVENTS = {
  update: true,
  finish: true
}

/**
 * disable setID() functionality
 */
MatchModel.prototype.setID = undefined

MatchModel.prototype.SAVEFORMAT = Object.create(IndexedModel.prototype.SAVEFORMAT)
MatchModel.prototype.SAVEFORMAT.g = Number
MatchModel.prototype.SAVEFORMAT.t = [Number]
MatchModel.prototype.SAVEFORMAT.place = String
export default MatchModel
