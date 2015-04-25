/**
 * A ListModel, which also adjusts the ids using setID
 *
 * @return IndexedListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './listmodel', './listupdatelistener'], function(extend,
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
  IndexedListModel.prototype.updateIDs = function(data) {
    var index, startindex;

    startindex = data.id || 0;

    for (index = startindex; index < this.length; index += 1) {
      this.get(index).setID(index);
    }
  };

  return IndexedListModel;
});
