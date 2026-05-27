import MatchResult from './matchresult.js'
import MatchReferenceModel from './matchreferencemodel.js'

/**
 * Constructor
 *
 * @param result
 *          a MatchResult instance
 * @param teamlist
 *          a ListModel instance of team ids, which is used for team mapping
 */
class ResultReferenceModel extends MatchResult {
  constructor (result, teamlist) {
    let matchRef
    if (result instanceof MatchResult) {
      matchRef = new MatchReferenceModel(result, teamlist)
      super(matchRef, result.score)
      this.result = result
    } else {
      // Open match: replicate MatchReferenceModel initialization inline
      // (can't use mixin pattern with ES6 class constructors)
      const tl = teamlist
      const mappedTeams = tl ? result.teams.map(t => tl.get(t)) : result.teams.slice()
      super({ teams: mappedTeams, id: result.id, group: result.group }, undefined)
      this.match = result
      this.updateTeams = function () {
        this.teams = tl ? this.match.teams.map(t => tl.get(t)) : this.match.teams.slice()
      }
      this.updatePlace = function () {
        this.place = this.match.place
      }
      this.finish = MatchReferenceModel.prototype.finish
      result.registerListener(this)
    }
  }
}

export default ResultReferenceModel
