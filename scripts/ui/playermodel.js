/**
 * A Model for each single Player
 *
 * @return PlayerModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/model"], function (extend, Model) {

  /**
   * remove extra white spaces from a player name
   *
   * @param name
   *          the name
   * @return a trimmed version of the name
   */
  function trimName(name) {
    return name.trim().replace(/\s+/g, " ");
  }

  /**
   * Constructor
   *
   * @param name
   *          the player name
   */
  function PlayerModel(name) {
    PlayerModel.superconstructor.call(this);

    this.club = "";
    this.email = "";
    this.license = "";
    this.firstname = "";
    this.lastname = "";
    this.elo = 0;
    this.rankingpoints = 0;
    this.alias = PlayerModel.NONAME;

    this.setName(name);
  }
  extend(PlayerModel, Model);
  PlayerModel.NONAME = "noname";

  /**
   * retrieve a copy of the player name
   *
   * @return a copy of the player name
   */
  PlayerModel.prototype.getName = function () {
    return this.alias.slice(0);
  };

  /**
   * change the player name. Invalid player names (empty or whitespace only)
   * will be ignored
   *
   * @param name
   *          the new name
   */
  PlayerModel.prototype.setName = function (name) {
    name = trimName(name || "");
    if (name && name !== this.alias) {
      this.alias = name;
      this.emit("update");
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
  PlayerModel.prototype.save = function () {
    var data = PlayerModel.superclass.save.call(this);

    data.n = this.getName();

    if (this.club) {
      data.club = this.club;
    }

    if (this.email) {
      data.email = this.email;
    }

    if (this.license) {
      data.license = this.license;
    }

    if (this.firstname) {
      data.firstname = this.firstname;
    }

    if (this.lastname) {
      data.lastname = this.lastname;
    }

    if (this.elo) {
      data.elo = this.elo;
    }

    if (this.rankingpoints) {
      data.rankingpoints = this.rankingpoints;
    }

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  PlayerModel.prototype.restore = function (data) {
    if (!PlayerModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.setName(data.n);

    if (data.club) {
      this.club = data.club;
    }

    if (data.email) {
      this.email = data.email;
    }

    if (data.license) {
      this.license = data.license;
    }

    if (data.firstname) {
      this.firstname = data.firstname;
    }

    if (data.lastname) {
      this.lastname = data.lastname;
    }

    if (data.lastname) {
      this.elo = data.elo;
    }

    if (data.rankingpoints) {
      this.rankingpoints = data.rankingpoints;
    }

    return true;
  };

  return PlayerModel;
});
