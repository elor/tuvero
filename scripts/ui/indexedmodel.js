/**
 * A combination of players is a team. A team should contain at least one player
 * 
 * @exports IndexedModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {

  /**
   * Constructor
   * 
   * @param players
   *          an array of PlayerModel instances
   * @param id
   *          a preferably unique numeric id
   */
  function IndexedModel (id) {
    IndexedModel.superconstructor.call(this);

    this.setID(id);
  }
  extend(IndexedModel, Model);

  /**
   * retrieve the id
   * 
   * @returns the id
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
      this.emit('update');
    }
  };

  return IndexedModel;
});
