import ListModel from './listmodel.js'

/**
 * Constructor
 *
 * @param indexlist
 *          a list of integer indices
 * @param maplist
 *          a static list, which contains elements that are indexed by
 *          indexlist. This class does not listen for changes in the map
 */
class MapListModel extends ListModel {
  constructor (indexlist, maplist) {
    super()
    this.makeReadonly()
    this.indices = indexlist
    this.map = maplist
    this.indices.forEach(function (index, pos) {
      MapListModel.insertID(this, pos)
    }, this)
    this.indices.registerListener(this)
  }

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  oninsert (emitter, event, data) {
    if (emitter === this.indices) {
      MapListModel.insertID(this, data.id)
    }
  }

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onremove (emitter, event, data) {
    if (emitter === this.indices) {
      MapListModel.removeID(this, data.id)
    }
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onreset (emitter, event, data) {
    if (emitter === this.indices) {
      this.emit(event, data)
    }
  }

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MapListModel instance
   * @param pos
   *          the id to insert at
   */
  static insertID (list, pos) {
    let ref
    ref = list.map.get(list.indices.get(pos))
    ListModel.prototype.insert.call(list, pos, ref)
  }

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MapListModel instance
   * @param id
   *          the id to remove
   */
  static removeID (list, id) {
    ListModel.prototype.remove.call(list, id)
  }
}

/*
 * Note to self:
 *
 * There's no need to intercept onresize, because the remove and insert
 * functions automatically emit resize events.
 */
export default MapListModel
