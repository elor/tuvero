/**
 * KOListModel
 *
 * @return KOListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/binningreferencelistmodel'], function(extend,
    BinningReferenceListModel) {

  /**
   * Constructor
   *
   * @param tournament
   *          a KOTournamentModel instance
   */
  function KOListModel(tournament) {
    KOListModel.superconstructor.call(this, tournament.getCombinedHistory(),
        this.binningFunction);
  }
  extend(KOListModel, BinningReferenceListModel);

  /**
   * @param match
   *          a MatchModel instance
   * @return which KO Tree Group this match belongs to. The match for third
   *         place is shown in the tree for first place, and so on.
   */
  KOListModel.prototype.binningFunction = function(match) {
    /*
     * Just strip the '1' bit from the match group, if it's set
     *
     * If you're reading this and don't understand the following bit operations,
     * have a look at the following url for clarification:
     * http://stackoverflow.com/questions/3920307/how-can-i-remove-a-flag-in-c
     */
    return match.getGroup(0) & ~0x1;
  };

  return KOListModel;
});
