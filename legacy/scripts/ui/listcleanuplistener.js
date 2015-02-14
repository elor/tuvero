/**
 * automatically destroy the which have been removed from a list
 *
 * @return ListCleanupListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listener'], function(extend, Listener) {

  /**
   * Constructor
   *
   * @param listmodel
   *          the ListModel instance
   */
  function ListCleanupListener(listmodel) {
    ListCleanupListener.superconstructor.call(this, listmodel);
  }
  extend(ListCleanupListener, Listener);

  /**
   * Callback function, which destroys removed objects
   */

  ListCleanupListener.prototype.onremove = function(emitter, event, data) {
    if (!data) {
      console.warn('ListCleanupListener: no data object emitted');
      return;
    }
    if (!data.object) {
      console.warn('ListCleanupListener: data contains no object property');
      return;
    }
    if (!data.object.destroy) {
      console.warn('ListCleanupListener: data.object has no destroy method');
      return;
    }

    data.object.destroy();
  };

  return ListCleanupListener;
});
