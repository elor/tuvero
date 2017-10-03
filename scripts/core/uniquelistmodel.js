/**
 * UniqueListModel: A ListModel in which a value or reference is contained at
 * most once.
 *
 * @return UniqueListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'list/listmodel'], function(extend, ListModel) {
  /**
   * Constructor
   *
   * @param array
   *          Optional. An array with elements which to fill the list with
   */
  function UniqueListModel(array) {
    UniqueListModel.superconstructor.call(this, array);
  }
  extend(UniqueListModel, ListModel);

  /**
   * push() function, which appends an object to the end of the list if it isn't
   * already contained
   *
   * @param object
   *          an object which will be appended to the list
   * @return the new length of the array. undefined on failure
   */
  UniqueListModel.prototype.push = function(object) {
    if (this.indexOf(object) !== -1) {
      return undefined;
    }
    return UniqueListModel.superclass.push.call(this, object);
  };

  /**
   * insert an object at the specified index if it isn't already contained
   *
   * @param index
   *          the index at which to insert the object
   * @param object
   *          the object, which will take the specified index after insertion
   * @return undefined on failure, true othwerise
   */
  UniqueListModel.prototype.insert = function(index, object) {
    if (this.indexOf(object) !== -1) {
      return undefined;
    }
    return UniqueListModel.superclass.insert.call(this, index, object);
  };

  /**
   * overwrites (i.e. removes and inserts) an object at the specified index if
   * it isn't already contained. If it is contained, the old value will remain
   * in the list.
   *
   * @param index
   *          the index within the list
   * @param object
   *          the object with which to overwrite the index
   * @return the inserted object, of undefined on failure
   */
  UniqueListModel.prototype.set = function(index, object) {
    if (this.indexOf(object) !== -1) {
      return undefined;
    }
    return UniqueListModel.superclass.set.call(this, index, object);
  };

  return UniqueListModel;
});
