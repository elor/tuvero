/**
 * CombinedReferenceListModel:
 *
 * @return CombinedReferenceListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {
  /**
   * @param list1
   *          a ListModel instance
   * @param list2
   *          a ListModel instance. The contents of every argument of this list
   *          are merged into a single list (i.e. this)
   */
  function CombinedReferenceListModel(list1, list2) {
    var i;
    CombinedReferenceListModel.superconstructor.call(this);

    this.makeReadonly();

    if (list1 === undefined) {
      throw new Error('No lists to combine');
    }

    this.refLists = [];
    this.listOffsets = [];
    for (i = 0; i < arguments.length; i += 1) {
      this.refLists.push(arguments[i]);
      this.listOffsets.push(0);
    }

    this.refLists.map(function(refList, listID) {
      refList.map(function(element, elementID) {
        CombinedReferenceListModel.insertElement(this, listID, elementID);
      }, this);

      refList.registerListener(this);
    }, this);

  }
  extend(CombinedReferenceListModel, ListModel);

  /**
   * Callback function. Also inserts the inserted element into the sorted list,
   * at the correct position
   *
   * @param emitter
   *          Should be this.refList
   * @param evt
   *          'insert'
   * @param data
   *          a data object, as emitted by insert() from the original list
   */
  CombinedReferenceListModel.prototype.oninsert = function(emitter, evt, data) {
    var listIndex = this.refLists.indexOf(emitter);
    if (listIndex !== -1) {
      CombinedReferenceListModel.insertElement(this, listIndex, data.id);
    }
  };

  /**
   * Callback function. Also removes the removed element from the sorted list
   *
   * @param emitter
   *          Should be this.refList
   * @param evt
   *          'remove'
   * @param data
   *          a data object, as emitted by remove() from the original list
   */
  CombinedReferenceListModel.prototype.onremove = function(emitter, evt, data) {
    var listIndex = this.refLists.indexOf(emitter);
    if (listIndex !== -1) {
      CombinedReferenceListModel.removeElement(this, listIndex, data.id);
    }
  };

  /**
   * insert an element into a sorted list
   *
   * @param listID
   *          the sorted list into which to insert the element
   * @param elementID
   *          the element to insert into the list
   */
  CombinedReferenceListModel.insertElement = function(list, listID, elementID) {
    var index = list.findPosition(listID, elementID);

    if (index !== -1) {
      CombinedReferenceListModel.superclass.insert.call(list, index,
          list.refLists[listID].get(elementID));
      list.increaseOffsets(listID);
    }
  };

  /**
   * Remove an element from a sorted list
   *
   * @param list
   *          the list from which to remove one occurence of the element
   * @param element
   *          the element to remove from the list
   */
  CombinedReferenceListModel.removeElement = function(list, listID, elementID) {
    var index = list.findPosition(listID, elementID);
    if (index !== -1) {
//      debugger
      CombinedReferenceListModel.superclass.remove.call(list, index);
      list.reduceOffsets(listID);
    }
  };

  /**
   *
   * @param listID
   *          the id of the original list inside the combined list (i.e. the
   *          argument position at construction)
   * @param elementID
   *          the index of the element inside its original list
   * @return the supposed index of the element inside the combined list, or -1
   *         if it shouldn't be inside it
   */
  CombinedReferenceListModel.prototype.findPosition = function(listID,
      elementID) {
    return this.listOffsets[listID] + elementID;
  };

  CombinedReferenceListModel.prototype.increaseOffsets = function(
      startingListIndex) {
    var id;
    for (id = startingListIndex + 1; id < this.listOffsets.length; id += 1) {
      this.listOffsets[id] += 1;
    }
  };

  CombinedReferenceListModel.prototype.reduceOffsets = function(
      startingListIndex) {
    var id;
    for (id = startingListIndex + 1; id < this.listOffsets.length; id += 1) {
      this.listOffsets[id] -= 1;
    }
  };

  return CombinedReferenceListModel;
});
