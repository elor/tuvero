/**
 * ProgressListModel
 *
 * @return ProgressListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import BinningReferenceListModel from '../list/binningreferencelistmodel.js';
import SortedReferenceListModel from '../list/sortedreferencelistmodel.js';
import CombinedReferenceListModel from '../list/combinedreferencelistmodel.js';
import ReferenceListModel from '../list/referencelistmodel.js';
import ReverseMatchReferenceModel from './reversematchreferencemodel.js';
import ReverseResultReferenceModel from './reverseresultreferencemodel.js';
/**
 * Constructor
 */
function ProgressListModel(tournament) {
  ProgressListModel.superconstructor.call(this, this.createSortedList(tournament), this.binningFunction);
}
extend(ProgressListModel, BinningReferenceListModel);

/**
 * @param tournament
 *          a TournamentModel instance
 * @return a ListModel containing all matches and their reversed counterparts
 */
ProgressListModel.prototype.createCombinedList = function (tournament) {
  var matches, reverseMatches, history, reverseHistory;
  matches = tournament.getMatches();
  reverseMatches = new ReferenceListModel(matches, undefined, ReverseMatchReferenceModel);
  history = tournament.getHistory();
  reverseHistory = new ReferenceListModel(history, undefined, ReverseResultReferenceModel);
  return new CombinedReferenceListModel(matches, reverseMatches, history, reverseHistory);
};

/**
 * @param tournament
 *          a TournamentModel instance
 * @return a sorted ListModel containing all matches and their reversed
 *         counterparts, where the matches are unique (e.g. no duplicate byes)
 */
ProgressListModel.prototype.createSortedList = function (tournament) {
  return new SortedReferenceListModel(this.createCombinedList(tournament), this.sortFunction, true);
};

/**
 * @param a
 *          a MatchModel instance
 * @param b
 *          another MatchModel instance
 * @return the order relation between the two
 */
ProgressListModel.prototype.sortFunction = function (a, b) {
  return a.getTeamID(0) - b.getTeamID(0) || a.getGroup() - b.getGroup();
};

/**
 * @param match
 *          a MatchModel instance
 * @return the first team id of the match, as used in a progress table
 */
ProgressListModel.prototype.binningFunction = function (match) {
  return match.getTeamID(0);
};
export default ProgressListModel;