/**
 * A ListModel, which also adjusts the ids using setID
 *
 * @return IndexedListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "list/listmodel", "list/listupdatelistener"], function (extend,
    ListModel, ListUpdateListener) {
  /**
   * Constructor for an empty list
   */
  function IndexedListModel() {
    IndexedListModel.superconstructor.call(this);

    ListUpdateListener.bind(this, this.updateIDs);
  }
  extend(IndexedListModel, ListModel);

  /**
   * update the ids, starting at the specified index
   *
   * @param data
   *          event callback data
   */
  IndexedListModel.prototype.updateIDs = function (data) {
    var index, startindex;

    if (data === undefined) {
      // 'reset' event, where no data is sent
      return;
    }

    startindex = data.id || 0;

    for (index = startindex; index < this.length; index += 1) {
      this.get(index).setID(index);
    }
  };

  return IndexedListModel;
});
