/**
 * A model for listed content, which may be extended for practical use cases
 * 
 * @exports ListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {
  /**
   * Constructor
   */
  function ListModel () {
    ListModel.superconstructor.call(this);
  }
  extend(ListModel, Model);

  /**
   * Get a reference to the object at the given index
   * 
   * @param index
   *          Index of the element
   * @returns an object representing the item at the given index
   */
  ListModel.prototype.getItem = function (index) {
    return {
      text : 'Item #' + index,
    };
  };

  /**
   * get the number of items
   * 
   * @returns the number of Items. Less or equal 0 indicates an empty list
   */
  ListModel.prototype.numItems = function () {
    return 5;
  };

  return ListModel;
});
