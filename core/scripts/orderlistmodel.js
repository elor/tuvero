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
define(['lib/extend', './listmodel', 'lib/diff'], function(extend, ListModel,
    Diff) {

  /**
   * get a diff of two integer arrays
   *
   * @param a
   *          the first array of integers
   * @param b
   *          the second array of integers
   * @returns a diff array, where each element contains a value, removed and
   *          added property. The value property is an array of numbers, while
   *          the removed/added properties are true if the values need to be
   *          removed/added
   */
  function getDiff(a, b) {
    var diff;
    a = a.join('\n');
    if (a.length > 0) {
      a += '\n'
    }
    b = b.join('\n');
    if (b.length > 0) {
      b += '\n'
    }
    diff = Diff.diffLines(a, b);
    diff.forEach(function(lines) {
      lines.value = lines.value.replace(/\n$/, '').split('\n').map(Number);
    });
    return diff;
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
   * insert/remove elements to match the given order. Use as few
   * insertions/removals as possible
   *
   * @param order
   *          The wanted end result
   */
  OrderListModel.prototype.enforceOrder = function(order) {
    var index, diff;

    diff = getDiff(this.list, order);

    index = 0;
    diff.forEach(function(lines) {
      lines.value.forEach(function(value) {
        if (lines.added) {
          OrderListModel.superclass.insert.call(this, index, value);
        } else if (lines.removed) {
          OrderListModel.superclass.remove.call(this, index);
          index -= 1;
        }
        index += 1;
      }, this);
    }, this);
  };

  return OrderListModel;
});
