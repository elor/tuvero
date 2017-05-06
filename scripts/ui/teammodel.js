/**
 * A combination of players is a team. A team should contain at least one player *
 *
 * @return TeamModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/indexedmodel', './playermodel'], function(extend,
    IndexedModel, PlayerModel) {

  /**
   * Constructor
   *
   * @param players
   *          an array of PlayerModel instances
   * @param id
   *          a preferably unique numeric team id
   */
  function TeamModel(players, id) {
    TeamModel.superconstructor.call(this, id);

    this.setPlayers(players);
  }
  extend(TeamModel, IndexedModel);

  /**
   * .length represents the size of the team
   */
  TeamModel.prototype.length = 0;

  /**
   * retrieve a single player. For the number of players, see
   * TeamModel.prototype.length
   *
   * @param id
   *          the index of the player inside the team
   * @return a PlayerModel reference
   */
  TeamModel.prototype.getPlayer = function(id) {
    if (id >= 0 && id < this.length) {
      return this.players[id];
    }
    return undefined;
  };

  /**
   * DO NOT USE DIRECTLY (why not?)
   *
   * @param players
   *          an array of PlayerModel instances
   */
  TeamModel.prototype.setPlayers = function(players) {
    players = players || [];
    if (players.length === 0) {
      players.push(new PlayerModel());
    }
    this.length = players.length;
    this.players = players.slice(0);
    this.players.forEach(function(player) {
      player.registerListener(this);
    }, this);

    console.log(this.getNames());
  };

  TeamModel.prototype.getNames = function () {
      return this.players.map(function (player) {
          return player.getName();
      });
  };

  /**
   * Callback listener
   *
   * One of the player names was updated. This is passed through to the team
   * event emitter.
   *
   * @param emitter
   *          a PlayerModel instance
   * @param event
   *          the event type
   *
   */
  TeamModel.prototype.onupdate = function(emitter, event) {
    var data;
    data = {
      id: this.players.indexOf(emitter)
    };
    this.emit('update', data);
  };

  TeamModel.prototype.SAVEFORMAT = Object
      .create(TeamModel.superclass.SAVEFORMAT);
  TeamModel.prototype.SAVEFORMAT.p = [Object];

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  TeamModel.prototype.save = function() {
    var data = TeamModel.superclass.save.call(this);

    data.p = this.players.map(function(player) {
      return player.save();
    });

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  TeamModel.prototype.restore = function(data) {
    if (!TeamModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.setPlayers(data.p.map(function(player) {
      var p = new PlayerModel();
      p.restore(player);
      return p;
    }));

    return true;
  };

  return TeamModel;
});