/**
 * A ListModel, which also adjusts the ids using setID
 *
 * @return IndexedListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/listmodel'], function(extend, ListModel) {
  /**
   * Constructor for an empty list
   */
  function IndexedListModel() {
    IndexedListModel.superconstructor.call(this);
  }
  extend(IndexedListModel, ListModel);

  /**
   * update the ids, starting at the specified index
   *
   * @param startindex
   *          the index with which to start. Defaults to 0
   */
  IndexedListModel.prototype.updateIDs = function(startindex) {
    var index;

    startindex = startindex || 0;

    for (index = startindex; index < this.length; index += 1) {
      this.get(index).setID(index);
    }
  };

  /**
   * Callback function
   *
   * @param emitter
   *          should be equal to this
   * @param event
   *          should be equal to 'insert'
   * @param data
   *          a data object containing 'id' and 'object' fields
   */
  IndexedListModel.prototype.oninsert = function(emitter, event, data) {
    IndexedListModel.superclass.oninsert.call(this, emitter, event, data);
    this.updateIDs(data.id);
  };

  /**
   * Callback function
   *
   * @param emitter
   *          should be equal to this
   * @param event
   *          should be equal to 'remove'
   * @param data
   *          a data object containing 'id' and 'object' fields
   */
  IndexedListModel.prototype.onremove = function(emitter, event, data) {
    IndexedListModel.superclass.onremove.call(this, emitter, event, data);
    this.updateIDs(data.id);
  };

  return IndexedListModel;
});
