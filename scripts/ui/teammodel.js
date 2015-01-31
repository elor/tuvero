/**
 * A combination of players is a team. A team should contain at least one player
 *
 * @exports TeamModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './indexedmodel', './playermodel'], function(extend, IndexedModel, PlayerModel) {

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

    var index;

    players = players || [];
    if (players.length === 0) {
      players.push(new PlayerModel());
    }
    this.length = players.length;
    this.players = players.slice(0);
    for (index in this.players) {
      this.players[index].registerListener(this);
    }
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
   * Callback listener
   *
   * One of the player names was updated. This is passed through to the team
   * event emitter.
   *
   */
  TeamModel.prototype.onupdate = function() {
    this.emit('update');
  };

  return TeamModel;
});
