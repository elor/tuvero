/**
 * ReverseMatchReferenceModel
 *
 * @return ReverseMatchReferenceModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/matchreferencemodel'], function(extend,
    MatchReferenceModel) {
  /**
   * Constructor
   */
  function ReverseMatchReferenceModel(match, teamlist) {
    ReverseMatchReferenceModel.superconstructor.call(this, match, teamlist);
    this.teams.reverse();
  }
  extend(ReverseMatchReferenceModel, MatchReferenceModel);

  /**
   * used by TournamentModel.correct() to determine whether the teams are
   * reversed
   */
  ReverseMatchReferenceModel.prototype.hasReversedTeams = true;

  /**
   * reverse the score before finishing the match
   *
   * @param score
   *          an array of score numbers
   * @return true on success, undefined otherwise
   */
  ReverseMatchReferenceModel.prototype.finish = function(score) {
    score = score.slice();
    score.reverse();
    return ReverseMatchReferenceModel.superclass.finish.call(this, score);
  };

  return ReverseMatchReferenceModel;
});
