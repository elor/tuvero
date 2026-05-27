import Listener from '../core/listener.js'

/**
 * Constructor
 *
 * @param listmodel
 *          the ListModel instance
 */
class ListCleanupListener extends Listener {
  constructor (listmodel) {
    super(listmodel)
  }

  /**
   * Callback function, which destroys removed objects
   */

  onremove (emitter, event, data) {
    if (!data) {
      console.warn('ListCleanupListener: no data object emitted')
      return
    }
    if (!data.object) {
      console.warn('ListCleanupListener: data contains no object property')
      return
    }
    if (!data.object.destroy) {
      console.warn('ListCleanupListener: data.object has no destroy method')
      return
    }
    data.object.destroy()
  }
}

export default ListCleanupListener
