import BinningReferenceListModel from '../list/binningreferencelistmodel.js'

/**
 * Constructor
 *
 * @param tournament
 *          a KOTournamentModel instance
 */
class KOListModel extends BinningReferenceListModel {
  constructor (tournament) {
    super(tournament.getCombinedHistory(), KOListModel.binningFunction)
  }

  /**
   * @param match
   *          a MatchModel instance
   * @return which KO Tree Group this match belongs to. The match for third
   *         place is shown in the tree for first place, and so on.
   */
  static binningFunction (match) {
    /*
     * Just strip the '1' bit from the match group, if it's set
     *
     * If you're reading this and don't understand the following bit operations,
     * have a look at the following url for clarification:
     * http://stackoverflow.com/questions/3920307/how-can-i-remove-a-flag-in-c
     */
    return match.getGroup(0) & ~0x1
  }
}

export default KOListModel
