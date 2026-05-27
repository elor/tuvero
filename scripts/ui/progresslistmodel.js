import BinningReferenceListModel from '../list/binningreferencelistmodel.js'
import SortedReferenceListModel from '../list/sortedreferencelistmodel.js'
import CombinedReferenceListModel from '../list/combinedreferencelistmodel.js'
import ReferenceListModel from '../list/referencelistmodel.js'
import ReverseMatchReferenceModel from './reversematchreferencemodel.js'
import ReverseResultReferenceModel from './reverseresultreferencemodel.js'

/**
 * Constructor
 */
class ProgressListModel extends BinningReferenceListModel {
  constructor (tournament) {
    super(
      ProgressListModel.createSortedList(tournament),
      ProgressListModel.binningFunction
    )
  }

  /**
   * @param tournament
   *          a TournamentModel instance
   * @return a ListModel containing all matches and their reversed counterparts
   */
  static createCombinedList (tournament) {
        const matches = tournament.getMatches()
    const reverseMatches = new ReferenceListModel(matches, undefined, ReverseMatchReferenceModel)
    const history = tournament.getHistory()
    const reverseHistory = new ReferenceListModel(history, undefined, ReverseResultReferenceModel)
    return new CombinedReferenceListModel(matches, reverseMatches, history, reverseHistory)
  }

  /**
   * @param tournament
   *          a TournamentModel instance
   * @return a sorted ListModel containing all matches and their reversed
   *         counterparts, where the matches are unique (e.g. no duplicate byes)
   */
  static createSortedList (tournament) {
    return new SortedReferenceListModel(
      ProgressListModel.createCombinedList(tournament),
      ProgressListModel.sortFunction,
      true
    )
  }

  /**
   * @param a
   *          a MatchModel instance
   * @param b
   *          another MatchModel instance
   * @return the order relation between the two
   */
  static sortFunction (a, b) {
    return a.getTeamID(0) - b.getTeamID(0) || a.getGroup() - b.getGroup()
  }

  /**
   * @param match
   *          a MatchModel instance
   * @return the first team id of the match, as used in a progress table
   */
  static binningFunction (match) {
    return match.getTeamID(0)
  }
}

export default ProgressListModel
