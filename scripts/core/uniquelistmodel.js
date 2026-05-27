import ListModel from '../list/listmodel.js'

/**
 * Constructor
 *
 * @param array
 *          Optional. An array with elements which to fill the list with
 */
class UniqueListModel extends ListModel {
  /**
   * push() function, which appends an object to the end of the list if it isn't
   * already contained
   *
   * @param object
   *          an object which will be appended to the list
   * @return the new length of the array. undefined on failure
   */
  push (object) {
    if (this.indexOf(object) !== -1) {
      return undefined
    }
    return super.push(object)
  }

  /**
   * insert an object at the specified index if it isn't already contained
   *
   * @param index
   *          the index at which to insert the object
   * @param object
   *          the object, which will take the specified index after insertion
   * @return undefined on failure, true othwerise
   */
  insert (index, object) {
    if (this.indexOf(object) !== -1) {
      return undefined
    }
    return super.insert(index, object)
  }

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
  set (index, object) {
    if (this.indexOf(object) !== -1) {
      return undefined
    }
    return super.set(index, object)
  }
}

export default UniqueListModel
