/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model', './playermodel' ], function (extend, Model, PlayerModel) {

  function TeamModel (players) {
    TeamModel.superconstructor.call(this);

    var index;

    this.length = players.length;
    this.players = players.slice(0);
    for (index in this.players) {
      this.players[index].registerListener(this);
    }
  }
  extend(TeamModel, Model);

  TeamModel.prototype.getPlayer = function (id) {
    if (id >= 0 && id < this.length) {
      return this.players[id];
    }
    return undefined;
  };

  TeamModel.prototype.onupdate = function () {
    // one of the player names was updated. Let's just pass this event through
    this.emit('update');
  };

});
