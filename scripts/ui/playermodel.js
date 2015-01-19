/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {

  function PlayerModel (name) {
    PlayerModel.superconstructor.call(this);
    this.setName(name);
  }
  extend(PlayerModel, Model);

  PlayerModel.prototype.getName = function () {
    return this.name;
  };

  PlayerModel.prototype.setName = function (name) {
    this.name = name || '';
    this.emit('update');
  };

  return PlayerModel;
});