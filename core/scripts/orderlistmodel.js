/**
 * OrderListModel: a ListModel, for which an order can be enforced. This was
 * first introduced to convert RankingModel.get().displayOrder into a ListModel
 * of TeamIDs for later visualization, hence the name "OrderListModel".
 *
 * The promise is to enforce ordered lists while minimizing insert/remove
 * operations
 *
 * @return OrderListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {
  /**
   * @param array
   *          an array of unique integers
   * @return an array where key and value have been switched
   *
   */
  function invertKeyValueArray(array) {
    var inverted = [];

    array.forEach(function(value, key) {
      inverted[value] = key;
    });

    return inverted;
  }

  /**
   * Constructor
   */
  function OrderListModel() {
    OrderListModel.superconstructor.call(this);
    this.makeReadonly();
  }
  extend(OrderListModel, ListModel);

  /**
   * @param order
   *          an array of unique integers, where the index matches the value of
   *          the elements within this list and the value matches the index
   *          within this list
   */
  OrderListModel.prototype.enforceOrder = function(order) {
    var val, id;

    // remove missing values
    // Not using map() because we're deleting values as we traverse.
    for (id = this.length - 1; id >= 0; id -= 1) {
      val = this.get(id);
      if (order[val] === undefined) {
        OrderListModel.superclass.remove.call(this, id);
      }
    }

    // move/insert values as required, starting at the bottom
    order.forEach(function(value, index) {
      var currentIndex;

      currentIndex = this.indexOf(value);

      if (currentIndex !== index) {
        if (currentIndex !== -1) {
          // no erase() required since no-one can write unwanted values
          OrderListModel.superclass.remove.call(this, currentIndex);
        }
        OrderListModel.superclass.insert.call(this, index, value);
      }
    }, this);
  };

  return OrderListModel;
});
