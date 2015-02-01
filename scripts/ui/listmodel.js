/**
 * A list object, which contains numerically indexed values for use with other
 * MVC classes
 *
 * @return ListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './model'], function(extend, Model) {

  /**
   * Constructor for an empty list
   */
  function ListModel() {
    ListModel.superconstructor.call(this);
    this.length = 0;
    this.list = [];

    this.registerListener(this);
  }
  extend(ListModel, Model);
  ListModel.prototype.EVENTS = {
    'reset': true,
    'insert': true,
    'remove': true,
    'resize': true
  };

  /**
   * push() function, which appends an object to the end of the list
   *
   * @param object
   *          an object which will be appended to the list
   * @return the new length of the array
   */
  ListModel.prototype.push = function(object) {
    var retval;

    retval = this.list.push(object);

    this.emit('insert', {
      id: this.list.length - 1,
      object: object
    });

    return retval;
  };

  /**
   * remove the last element of the array and returns it
   *
   * @return the previously last element of the array, which has been removed
   *         during this function call
   */
  ListModel.prototype.pop = function() {
    var object;

    object = this.list.pop();

    this.emit('remove', {
      id: this.list.length,
      object: object
    });

    return object;
  };

  /**
   * insert an object at the specified index
   *
   * @param index
   *          the index at which to insert the object
   * @param object
   *          the object, which will take the specified index after insertion
   */
  ListModel.prototype.insert = function(index, object) {
    if (index >= 0 && index <= this.list.length) {
      this.list.splice(index, 0, object);

      this.emit('insert', {
        id: index,
        object: object
      });
    }
  };

  /**
   * removes the object at the specified index from the list
   *
   * @param index
   *          the index from which to remove from the list
   * @return the removed object
   */
  ListModel.prototype.remove = function(index) {
    var object;

    if (index >= 0 && index < this.list.length) {
      object = this.list.splice(index, 1)[0];

      this.emit('remove', {
        id: index,
        object: object
      });

      return object;
    }

    return undefined;
  };

  /**
   * removes everything in the array.
   */
  ListModel.prototype.clear = function() {
    this.list = [];
    this.emit('reset');
  };

  /**
   * finds the index of an object, if available.
   *
   * @param object
   *          the object to look for
   * @return the index of the object in the array, or -1 otherwise
   */
  ListModel.prototype.indexOf = function(object) {
    return this.list.indexOf(object);
  };

  /**
   * access the element at the specified index
   *
   * @param index
   *          the index within the list
   * @return the object at the specified index
   */
  ListModel.prototype.get = function(index) {
    return this.list[index];
  };

  /**
   * overwrites (i.e. removes and inserts) an object at the specified index
   *
   * @param index
   *          the index within the list
   * @param object
   *          the object with which to overwrite the index
   * @return the inserted object, of undefined on failure
   */
  ListModel.prototype.set = function(index, object) {
    if (index >= 0 && index < this.list.length) {
      this.remove(index);
      this.insert(index, object);
      return object;
    }

    return undefined;
  };

  /**
   * for each element in the list, run the specified function. The return values
   * of the function are accumulated and returned as an array
   *
   * @param callback
   *          function(object, index, list)
   * @param thisArg
   *          Optional. Value to use as this when executing callback
   * @return an array of the functions return values
   */
  ListModel.prototype.map = function(callback, thisArg) {
    var index, ret;

    thisArg = thisArg || undefined;
    ret = [];

    for (index = 0; index < this.length; index += 1) {
      ret.push(callback.call(thisArg, this.get(index), index, this));
    }

    return ret;
  };

  /**
   * returns the contents of the list as an array
   *
   * @return the contents of the list as an array
   */
  ListModel.prototype.asArray = function() {
    return this.list.slice(0);
  };

  /**
   * update the length variable of the list. Used internally.
   */
  ListModel.prototype.updateLength = function() {
    this.length = this.list.length;
    this.emit('resize');
  };

  /**
   * Callback function: called when an 'insert' event is emitted
   */
  ListModel.prototype.oninsert = function() {
    this.updateLength();
  };

  /**
   * Callback function: called when a 'remove' event is emitted
   */
  ListModel.prototype.onremove = function() {
    this.updateLength();
  };

  /**
   * Callback function: called when a 'reset' event is emitted
   */
  ListModel.prototype.onreset = function() {
    this.updateLength();
  };

  return ListModel;
});
