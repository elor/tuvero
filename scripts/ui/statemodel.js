/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./listmodel', './indexedlistmodel', './valuemodel',
    './listcleanuplistener'], function(ListModel, IndexedListModel, ValueModel,
    ListCleanupListener) {

  /**
   * Constructor
   */
  function StateModel() {
    this.teams = new IndexedListModel();
    this.teamscleanuplistener = new ListCleanupListener(this.teams);
    this.teamsize = new ValueModel(3);
  }

  return StateModel;
});
