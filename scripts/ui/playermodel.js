/**
 * A Model for each single Player
 *
 * @return PlayerModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/model'], function(extend, Model) {

  /**
   * remove extra white spaces from a player name
   *
   * @param name
   *          the name
   * @return a trimmed version of the name
   */
  function trimName(name) {
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Constructor
   *
   * @param name
   *          the player name
   */
  function PlayerModel(name) {
    PlayerModel.superconstructor.call(this);
    this.name = PlayerModel.NONAME;
    this.setName(name);
  }
  extend(PlayerModel, Model);
  PlayerModel.NONAME = 'noname';

  /**
   * retrieve a copy of the player name
   *
   * @return a copy of the player name
   */
  PlayerModel.prototype.getName = function() {
    return this.name.slice(0);
  };

  /**
   * change the player name. Invalid player names (empty or whitespace only)
   * will be ignored
   *
   * @param name
   *          the new name
   */
  PlayerModel.prototype.setName = function(name) {
    name = trimName(name || '');
    if (name && name !== this.name) {
      this.name = name;
      this.emit('update');
    }
  };

  PlayerModel.prototype.SAVEFORMAT = Object
      .create(PlayerModel.superclass.SAVEFORMAT);
  PlayerModel.prototype.SAVEFORMAT.n = String;

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  PlayerModel.prototype.save = function() {
    var data = PlayerModel.superclass.save.call(this);

    data.n = this.name;

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  PlayerModel.prototype.restore = function(data) {
    if (!PlayerModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.setName(data.n);

    return true;
  };

  return PlayerModel;
});
