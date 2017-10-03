/**
 * ListExclusionListener: Strange name, but it's supposed to listen for a
 * boolean ValueModel instance and push an element to a list if its value
 * evaluates to true, and remove it otherwise.
 *
 * TODO find a better name
 *
 * @return ListExclusionListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener'], function(extend, Listener) {
  /**
   * Constructor
   *
   * @param trigger
   *          the ValueModel instance to listen to
   * @param list
   *          the list to add to/remove from
   * @param value
   *          the value to add/remove
   */
  function ListExclusionListener(trigger, list, value) {
    ListExclusionListener.superconstructor.call(this, trigger);

    this.trigger = trigger;
    this.list = list;
    this.value = value;
  }
  extend(ListExclusionListener, Listener);

  /**
   * push the value, if it's not in the list already
   */
  ListExclusionListener.prototype.add = function() {
    var index;

    index = this.list.indexOf(this.value);

    if (index === -1) {
      this.list.push(this.value);
    }
  };

  /**
   * remove all appearances of the value from the list
   */
  ListExclusionListener.prototype.remove = function() {
    var index;

    while ((index = this.list.indexOf(this.value)) !== -1) {
      this.list.remove(index);
    }
  };

  /**
   * Callback listener for the trigger. Call add()/remove() accordingly
   */
  ListExclusionListener.prototype.onupdate = function() {
    if (this.trigger.get()) {
      this.add();
    } else {
      this.remove();
    }
  };

  return ListExclusionListener;
});
