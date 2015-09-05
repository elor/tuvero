/**
 * SortedReferenceListModel:
 *
 * @return SortedReferenceListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {
  /**
   * @param list
   *          a ListModel instance
   * @param sortFunction
   *          Optional. A sort function to use for sorting the lists
   */
  function SortedReferenceListModel(list, sortFunction) {
    SortedReferenceListModel.superconstructor.call(this);

    this.makeReadonly();

    if (list === undefined) {
      throw new Error('SortedReferenceListModel: list argument is missing');
    }

    if (sortFunction === undefined) {
      sortFunction = SortedReferenceListModel.ascending;
    }

    this.refList = list;
    this.sortFunction = sortFunction;

    list.map(function(element) {
      SortedReferenceListModel.insertElement(this, element);
    }, this);

    list.registerListener(this);
  }
  extend(SortedReferenceListModel, ListModel);

  /**
   * Callback function. Also inserts the inserted element into the sorted list,
   * at the correct position
   *
   * @param emitter
   *          Should be this.refList
   * @param event
   *          'insert'
   * @param data
   *          a data object, as emitted by insert() from the original list
   */
  SortedReferenceListModel.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.refList) {
      SortedReferenceListModel.insertElement(this, data.object);
    }
  };

  /**
   * Callback function. Also removes the removed element from the sorted list
   *
   * @param emitter
   *          Should be this.refList
   * @param event
   *          'remove'
   * @param data
   *          a data object, as emitted by remove() from the original list
   */
  SortedReferenceListModel.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.refList) {
      SortedReferenceListModel.removeElement(this, data.object);
    }
  };

  /**
   * default sort function, for ascending order
   *
   * @param a
   *          the first object
   * @param b
   *          the second object
   * @return the ordering relation between the two, i.e. -1, 0 or +1
   */
  SortedReferenceListModel.ascending = function(a, b) {
    switch (true) {
    case a > b:
      return 1;
    case a < b:
      return -1;
    default:
      return 0;
    }
  };

  /**
   * alternative sort function, for descending order
   *
   * @param a
   *          the first object
   * @param b
   *          the second object
   * @return the ordering relation between the two, i.e. -1, 0 or +1
   */
  SortedReferenceListModel.descending = function(a, b) {
    return -SortedReferenceListModel.ascending(a, b);
  };

  /**
   * insert an element into a sorted list
   *
   * @param list
   *          the sorted list into which to insert the element
   * @param element
   *          the element to insert into the list
   */
  SortedReferenceListModel.insertElement = function(list, element) {
    var index = SortedReferenceListModel.findPosition(list, element);

    SortedReferenceListModel.superclass.insert.call(list, index, element);
  };

  /**
   * Remove an element from a sorted list
   *
   * @param list
   *          the list from which to remove one occurence of the element
   * @param element
   *          the element to remove from the list
   */
  SortedReferenceListModel.removeElement = function(list, element) {
    var index = list.indexOf(element);
    if (index >= 0) {
      SortedReferenceListModel.superclass.remove.call(list, index);
    }
  };

  /**
   * A simple binary search for the position at which to place the next element.
   * Since we're using >=0 in the second code path, similar values are always
   * appended.
   *
   * @param list
   *          the ListModel instance into which to insert the element. Should be
   *          "this" when called.
   * @param element
   *          the element to insert
   * @param begin
   *          Optional. The index at which to begin the search, inclusive.
   * @param end
   *          Optional. The index at which to end the search, exclusive.
   * @return the position at which an element is to be inserted. Can range from
   *         0 to list.length.
   */
  SortedReferenceListModel.findPosition = function(list, element, begin, end) {
    var relation, mid;

    if (begin === undefined) {
      begin = 0;
    }
    if (end === undefined) {
      end = list.length;
    }

    if (begin === end) {
      return begin;
    }

    mid = (begin + end) >> 1;

    relation = list.sortFunction(list.get(mid), element);

    if (relation > 0) {
      return SortedReferenceListModel.findPosition(list, element, begin, mid);
    }

    return SortedReferenceListModel.findPosition(list, element, mid + 1, end);
  };

  return SortedReferenceListModel;
});
