import Listener from '../core/listener.js'

/**
 * Constructor
 *
 * @param list
 *          the list object
 * @param callback
 *          the callback function of format function(data) { }
 */
class ListUpdateListener extends Listener {
  constructor (list, callback) {
    super(list)
    this.callback = callback
  }

  /**
   * general callback function
   *
   * @param emitter
   *          the list
   * @param event
   *          the event type
   * @param data
   *          a data object
   */
  update (emitter, event, data) {
    this.callback.call(emitter, data)
  }

  /**
   * bind function for self-commenting code and to avoid lint warnings
   *
   * @param list
   *          a ListModel instance
   * @param callback
   *          a callback function of the format function(data)
   * @return a valid ListUpdateListener instance on success
   */
  static bind (list, callback) {
    return new ListUpdateListener(list, callback)
  }
}

/**
 * collect different event types
 */
ListUpdateListener.prototype.onremove = ListUpdateListener.prototype.update
ListUpdateListener.prototype.onreset = ListUpdateListener.prototype.update
ListUpdateListener.prototype.oninsert = ListUpdateListener.prototype.update
export default ListUpdateListener
