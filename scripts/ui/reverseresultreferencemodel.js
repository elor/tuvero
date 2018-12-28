/**
 * ReverseResultReferenceModel
 *
 * @return ReverseResultReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/resultreferencemodel'], function (extend,
  ResultReferenceModel) {
  /**
   * Constructor
   */
  function ReverseResultReferenceModel (result, teamlist) {
    ReverseResultReferenceModel.superconstructor.call(this, result, teamlist)
    if (this.isBye()) {
      return
    }

    this.teams.reverse()
    this.score.reverse()
  }
  extend(ReverseResultReferenceModel, ResultReferenceModel)

  /**
   * used by TournamentModel.correct() to determine whether the teams are
   * reversed
   */
  ReverseResultReferenceModel.prototype.hasReversedTeams = true

  return ReverseResultReferenceModel
})
