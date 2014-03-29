/**
 * Maintain a sorted list of player names
 */

define(function () {
  var Player, names;

  names = [];

  Player = {};

  Player.fromBlob = function (blob) {
    var blobnames = JSON.parse(blob);
    if (!blobnames) {
      return;
    }

    // TODO verify array of strings
    // XXX implements.js?
    blobnames.sort();
    names = blobnames;

    require('./autocomplete').update();
  };

  Player.toBlob = function () {
    return JSON.stringify(names);
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

  return Player;
});
