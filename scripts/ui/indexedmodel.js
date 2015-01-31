/**
 * A combination of players is a team. A team should contain at least one player
 *
 * @return IndexedModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './interfaces/model'], function(extend, Model) {

  /**
   * Constructor
   *
   * @param id
   *          a preferably unique numeric id
   */
  function IndexedModel(id) {
    IndexedModel.superconstructor.call(this);

    this.setID(id);
  }
  extend(IndexedModel, Model);

  /**
   * retrieve the id of this object within a certain set of objects
   *
   * @return the id of this object within a certain set of objects
   */
  IndexedModel.prototype.getID = function() {
    return this.id;
  };

  /**
   * change the id
   *
   * @param id
   *          a preferably unique numeric id
   */
  IndexedModel.prototype.setID = function(id) {
    if (id === undefined) {
      id = -1;
    }
    if (id !== this.id) {
      this.id = id;
      this.emit('update');
    }
  };

  return IndexedModel;
});
