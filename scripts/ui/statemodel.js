/**
 * A class for collecting all necessary state information of one or more running
 * tournaments.
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./listmodel', './indexedlistmodel'], function(ListModel,
    IndexedListModel) {

  /**
   * Constructor. Instantiates the empty object
   */
  function StateModel() {
    this.players = new ListModel();
    this.teams = new IndexedListModel();
  }

  return StateModel;
});
