import Listener from '../core/listener.js';

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
class ListExclusionListener extends Listener {
  constructor(trigger, list, value) {
    super(trigger);
    this.trigger = trigger;
    this.list = list;
    this.value = value;
  }

  /**
   * push the value, if it's not in the list already
   */
  add() {
    let index;
    index = this.list.indexOf(this.value);
    if (index === -1) {
      this.list.push(this.value);
    }
  }

  /**
   * remove all appearances of the value from the list
   */
  remove() {
    let index;
    while ((index = this.list.indexOf(this.value)) !== -1) {
      this.list.remove(index);
    }
  }

  /**
   * Callback listener for the trigger. Call add()/remove() accordingly
   */
  onupdate() {
    if (this.trigger.get()) {
      this.add();
    } else {
      this.remove();
    }
  }
}

export default ListExclusionListener;