/**
 * A combination of players is a team. A team should contain at least one player
 * 
 * @exports TeamModel
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
   *          a preferably unique numeric team id
   */
  function TeamModel (players, id) {
    TeamModel.superconstructor.call(this);

    var index;

    this.length = players.length;
    this.id = id;
    this.players = players.slice(0);
    for (index in this.players) {
      this.players[index].registerListener(this);
    }
  }
  extend(TeamModel, Model);

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
   * @returns a PlayerModel reference
   */
  TeamModel.prototype.getPlayer = function (id) {
    if (id >= 0 && id < this.length) {
      return this.players[id];
    }
    return undefined;
  };

  /**
   * retrieve the id of the team
   * 
   * @returns the id of the team
   */
  TeamModel.prototype.getID = function () {
    return this.id;
  };

  /**
   * change the id of the team, e.g. after removing another team
   * 
   * @param id
   *          a preferably unique numeric team id
   */
  TeamModel.prototype.setID = function (id) {
    this.id = id;
    this.emit('update');
  };

  /**
   * Callback listener
   * 
   * One of the player names was updated. This is passed through to the team
   * event emitter.
   * 
   */
  TeamModel.prototype.onupdate = function () {
    this.emit('update');
  };

  return TeamModel;
});
