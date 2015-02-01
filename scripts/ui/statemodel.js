/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./listmodel', './indexedlistmodel', './valuemodel'], function(
    ListModel, IndexedListModel, ValueModel) {

  /**
   * Constructor
   */
  function StateModel() {
    this.players = new ListModel();
    this.teams = new IndexedListModel();
    this.teamsize = new ValueModel(3);
  }

  return StateModel;
});
