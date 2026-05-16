/**
 * ReverseMatchReferenceModel
 *
 * @return ReverseMatchReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import MatchReferenceModel from '../core/matchreferencemodel.js';
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
ReverseMatchReferenceModel.prototype.finish = function (score) {
  score = score.slice();
  score.reverse();
  return ReverseMatchReferenceModel.superclass.finish.call(this, score);
};
export default ReverseMatchReferenceModel;