/**
 * A model which has an index, e.g. inside an indexed list
 *
 * @return IndexedModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/model"], function (extend, Model) {

  /**
   * Constructor
   *
   * @param id
   *          a preferably unique numeric id
   */
  function IndexedModel(id) {
    IndexedModel.superconstructor.call(this);

    IndexedModel.prototype.setID.call(this, id);
  }
  extend(IndexedModel, Model);

  /**
   * retrieve the id of this object within a certain set of objects
   *
   * @return the id of this object within a certain set of objects
   */
  IndexedModel.prototype.getID = function () {
    return this.id;
  };

  /**
   * change the id
   *
   * @param id
   *          a preferably unique numeric id
   */
  IndexedModel.prototype.setID = function (id) {
    if (id === undefined) {
      id = -1;
    }
    if (id !== this.id) {
      this.id = id;
      this.emit("update");
    }
  };

  /**
   * save the current state to an object
   *
   * @return the current state, as a data object
   */
  IndexedModel.prototype.save = function () {
    var data = IndexedModel.superclass.save.call(this);

    data.id = this.id;

    return data;
  };

  /**
   * restore the current state from an object
   *
   * @param data
   *          a stored state
   * @return true on success, false otherwise
   */
  IndexedModel.prototype.restore = function (data) {
    if (!IndexedModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.id = data.id;

    return true;
  };

  IndexedModel.prototype.SAVEFORMAT = Object
      .create(IndexedModel.superclass.SAVEFORMAT);
  IndexedModel.prototype.SAVEFORMAT.id = Number;

  return IndexedModel;
});
