import ListModel from './listmodel.js';
import { diffLines } from 'diff';
/**
 * get a diffresult of two integer arrays
 *
 * @param a
 *          the first array of integers
 * @param b
 *          the second array of integers
 * @return a diffresult array, where each element contains a value, removed and
 *          added property. The value property is an array of numbers, while
 *          the removed/added properties are true if the values need to be
 *          removed/added
 */
function getdiff(a, b) {
  let diffresult;
  a = a.join('\n');
  if (a.length > 0) {
    a += '\n';
  }
  b = b.join('\n');
  if (b.length > 0) {
    b += '\n';
  }
  diffresult = diffLines(a, b);
  diffresult.forEach(function (lines) {
    lines.value = lines.value.replace(/\n$/, '').split('\n').map(Number);
  });
  return diffresult;
}

/**
 * Constructor
 */
class OrderListModel extends ListModel {
  constructor() {
    super();
    this.makeReadonly();
  }

  /**
   * insert/remove elements to match the given order. Use as few
   * insertions/removals as possible
   *
   * @param order
   *          The wanted end result
   */
  enforceOrder(order) {
    let index, diffresult;
    diffresult = getdiff(this.list, order);
    index = 0;
    diffresult.forEach((lines) => {
      lines.value.forEach((value) => {
        if (lines.added) {
          super.insert(index, value);
        } else if (lines.removed) {
          super.remove(index);
          index -= 1;
        }
        index += 1;
      });
    });
  }
}

export default OrderListModel;