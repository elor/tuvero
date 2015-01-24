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
   * remove extra white spaces from a player name
   * 
   * @param name
   *          the name
   * @returns a trimmed version of the name
   */
  function trimName (name) {
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Constructor
   * 
   * @param name
   *          the player name
   */
  function PlayerModel (name) {
    PlayerModel.superconstructor.call(this);
    this.name = PlayerModel.NONAME;
    this.setName(name);
  }
  extend(PlayerModel, Model);
  PlayerModel.NONAME = 'noname';

  /**
   * retrieve a copy of the player name
   * 
   * @returns a copy of the player name
   */
  PlayerModel.prototype.getName = function () {
    return this.name.slice(0);
  };

  /**
   * change the player name. Invalid player names (empty or whitespace only)
   * will be ignored
   * 
   * @param name
   *          the new name
   */
  PlayerModel.prototype.setName = function (name) {
    name = trimName(name || '');
    if (name && name != this.name) {
      this.name = name;
      this.emit('update');
    }
  };

  return PlayerModel;
});
