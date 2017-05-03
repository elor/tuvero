/**
 * ListUpdateListener: call the callback function whenever the list size has
 * been changed or reset
 *
 * @return ListUpdateListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listener'], function(extend, Listener) {
  /**
   * Constructor
   *
   * @param list
   *          the list object
   * @param callback
   *          the callback function of format function(data) { }
   */
  function ListUpdateListener(list, callback) {
    ListUpdateListener.superconstructor.call(this, list);

    this.callback = callback;
  }
  extend(ListUpdateListener, Listener);

  /**
   * bind function for self-commenting code and to avoid lint warnings
   *
   * @param list
   *          a ListModel instance
   * @param callback
   *          a callback function of the format function(data)
   * @return a valid ListUpdateListener instance on success
   */
  ListUpdateListener.bind = function(list, callback) {
    return new ListUpdateListener(list, callback);
  };

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
  ListUpdateListener.prototype.update = function(emitter, event, data) {
    this.callback.call(emitter, data);
  };

  /**
   * collect different event types
   */
  ListUpdateListener.prototype.onremove = ListUpdateListener.prototype.update;
  ListUpdateListener.prototype.onreset = ListUpdateListener.prototype.update;
  ListUpdateListener.prototype.oninsert = ListUpdateListener.prototype.update;

  return ListUpdateListener;
});
