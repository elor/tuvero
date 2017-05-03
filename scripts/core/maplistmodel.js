/**
 * MapListModel: map a list of indices to actual elements, which can be indexed
 * from a list. This is useful for mapping between local/global elements as a
 * readonly list.
 *
 * @return MapListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {

  /**
   * Constructor
   *
   * @param indexlist
   *          a list of integer indices
   * @param maplist
   *          a static list, which contains elements that are indexed by
   *          indexlist. This class does not listen for changes in the map
   */
  function MapListModel(indexlist, maplist) {
    MapListModel.superconstructor.call(this);

    this.makeReadonly();

    this.indices = indexlist;
    this.map = maplist;

    this.indices.map(function(index, pos) {
      MapListModel.insertID(this, pos);
    }, this);

    this.indices.registerListener(this);
  }
  extend(MapListModel, ListModel);

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MapListModel instance
   * @param pos
   *          the id to insert at
   */
  MapListModel.insertID = function(list, pos) {
    var ref;
    ref = list.map.get(list.indices.get(pos));
    ListModel.prototype.insert.call(list, pos, ref);
  };

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MapListModel instance
   * @param id
   *          the id to remove
   */
  MapListModel.removeID = function(list, id) {
    ListModel.prototype.remove.call(list, id);
  };

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  MapListModel.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.indices) {
      MapListModel.insertID(this, data.id);
    }
  };

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  MapListModel.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.indices) {
      MapListModel.removeID(this, data.id);
    }
  };

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  MapListModel.prototype.onreset = function(emitter, event, data) {
    if (emitter === this.indices) {
      this.emit(event, data);
    }
  };

  /*
   * Note to self:
   *
   * There's no need to intercept onresize, because the remove and insert
   * functions automatically emit resize events.
   */

  return MapListModel;
});
