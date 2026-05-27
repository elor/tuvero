import ResultReferenceModel from '../core/resultreferencemodel.js'

/**
 * Constructor
 */
class ReverseResultReferenceModel extends ResultReferenceModel {
  constructor (result, teamlist) {
    super(result, teamlist)
    if (this.isBye()) {
      return
    }
    this.teams.reverse()
    this.score.reverse()
  }
}

/**
 * used by TournamentModel.correct() to determine whether the teams are
 * reversed
 */
ReverseResultReferenceModel.prototype.hasReversedTeams = true
export default ReverseResultReferenceModel
