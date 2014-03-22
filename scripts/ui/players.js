/**
 * Maintain a sorted list of player names
 */

define(function () {
  var Player, names;

  Player = {};

  Player.read = function () {
    // TODO extract to Storage object
    names = JSON.parse(localStorage.getItem('players'));
    // TODO verify array of strings
    // XXX implements.js?
    names.sort();
  };

  Player.write = function () {
    // TODO extract to Storage object
    localStorage.setItem('players', JSON.stringify(names));
    // XXX necessary?
  };

  Player.clear = function () {
    names = [];
  };

  Player.get = function () {
    return names.slice();
  };

  Player.insert = function (name) {
    if (typeof (name) === 'string') {
      if (names.indexOf(name) === -1) {
        names.push(name);
        names.sort();
      }
    } else {
      console.error('ui/players.js: name is no string: ' + name);
    }
  };

  Player.erase = function (name) {
    // TODO do we need it?
  };

  Player.read();

  return Player;
});
