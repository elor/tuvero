/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['core/listmodel', 'core/indexedlistmodel', 'core/valuemodel',
    './listcleanuplistener', 'core/tournamentlistmodel'], function(ListModel,
    IndexedListModel, ValueModel, ListCleanupListener, TournamentListModel) {

  /**
   * Constructor
   */
  function StateModel() {
    this.teams = new IndexedListModel();
    this.teamscleanuplistener = new ListCleanupListener(this.teams);
    this.teamsize = new ValueModel(3);
    this.tournaments = new TournamentListModel();

    /*
     * TODO temporary hacks ahead. Please, for the love of code, keep them
     * temporary!
     */
    this.numTournaments = new ValueModel(0);
  }

  return StateModel;
});
