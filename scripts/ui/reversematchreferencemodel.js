import MatchReferenceModel from '../core/matchreferencemodel.js'

/**
 * Constructor
 */
class ReverseMatchReferenceModel extends MatchReferenceModel {
  constructor (match, teamlist) {
    super(match, teamlist)
    this.teams.reverse()
  }

  /**
   * reverse the score before finishing the match
   *
   * @param score
   *          an array of score numbers
   * @return true on success, undefined otherwise
   */
  finish (score) {
    score = score.slice()
    score.reverse()
    return super.finish(score)
  }
}

/**
 * used by TournamentModel.correct() to determine whether the teams are
 * reversed
 */
ReverseMatchReferenceModel.prototype.hasReversedTeams = true

export default ReverseMatchReferenceModel
