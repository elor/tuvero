/**
 * A Model for each single Player
 * 
 * @exports PlayerModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {

  /**
   * trim a player name from white spaces
   * 
   * @param name
   *          the name
   * @returns a trimmed version of the name
   */
  function trimName (name) {
    return name.replace(/^\s*|\s*$/g, '').replace(/\s\s*/g, ' ');
  }

  /**
   * Constructor
   * 
   * @param name
   *          the player name
   */
  function PlayerModel (name) {
    PlayerModel.superconstructor.call(this);
    this.name = 'noname';
    this.setName(name);
  }
  extend(PlayerModel, Model);

  /**
   * retrieve the player name
   * 
   * @returns the player name
   */
  PlayerModel.prototype.getName = function () {
    return this.name;
  };

  /**
   * change the player name. Invalid player names (empty or whitespace only)
   * will be ignored
   * 
   * @param name
   *          the new name
   */
  PlayerModel.prototype.setName = function (name) {
    name = trimName(name);
    if (name) {
      this.name = name;
      this.emit('update');
    }
  };

  return PlayerModel;
});
