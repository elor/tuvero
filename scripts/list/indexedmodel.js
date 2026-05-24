import Model from '../core/model.js';

/**
 * Constructor
 *
 * @param id
 *          a preferably unique numeric id
 */
class IndexedModel extends Model {
  constructor(id) {
    super();
    IndexedModel.prototype.setID.call(this, id);
  }

  /**
   * retrieve the id of this object within a certain set of objects
   *
   * @return the id of this object within a certain set of objects
   */
  getID() {
    return this.id;
  }

  /**
   * change the id
   *
   * @param id
   *          a preferably unique numeric id
   */
  setID(id) {
    if (id === undefined) {
      id = -1;
    }
    if (id !== this.id) {
      this.id = id;
      this.emit('update');
    }
  }

  /**
   * save the current state to an object
   *
   * @return the current state, as a data object
   */
  save() {
    const data = super.save();
    data.id = this.id;
    return data;
  }

  /**
   * restore the current state from an object
   *
   * @param data
   *          a stored state
   * @return true on success, false otherwise
   */
  restore(data) {
    if (!super.restore(data)) {
      return false;
    }
    this.id = data.id;
    return true;
  }
}

IndexedModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT);
IndexedModel.prototype.SAVEFORMAT.id = Number;
export default IndexedModel;