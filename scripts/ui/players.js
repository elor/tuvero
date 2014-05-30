/**
 * Maintain a sorted list of player names
 */

define(function () {
  var Player, names;

  names = [];

  Player = {};

  function trimName (name) {
    return name.replace(/^\s*|\s*$|\n|\r/g, '').replace(/\s\s*/g, ' ');
  }

  function updateDependencies () {
    require('./autocomplete').update();
    // TODO update storage
  }

  Player.fromString = function (string) {
    var lines, name;

    lines = string.split('\n');

    // strip the names from white spaces
    for (name in lines) {
      lines[name] = trimName(lines[name]);
    }

    // remove empty entries
    for (name = lines.length - 1; name >= 0; name -= 1) {
      if (lines[name].length === 0) {
        lines.splice(name, 1);
      }
    }

    // sort names
    lines.sort();

    // set names
    names = lines;

    // update
    updateDependencies();
  };

  Player.toString = function () {
    return names.join('\n');
  };

  Player.fromBlob = function (blob) {
    var blobnames = JSON.parse(blob);
    if (!blobnames) {
      return;
    }

    // TODO verify array of strings
    // via implements.js?
    blobnames.sort();
    names = blobnames;

    updateDependencies();
  };

  Player.toBlob = function () {
    return JSON.stringify(names);
  };

  Player.clear = function () {
    names = [];

    updateDependencies();
  };

  Player.get = function () {
    return names.slice();
  };

  Player.insert = function (name) {
    name = trimName(name);
    if (typeof (name) === 'string' && name.length > 0) {
      if (names.indexOf(name) === -1) {
        names.push(name);
        names.sort();
        updateDependencies();
      }
    } else {
      console.error('ui/players.js: name is no string: ' + name);
    }
  };

  Player.erase = function (name) {
    var index;
    name = trimName(name);
    if (typeof (name) === 'string' && name.length > 0) {
      index = names.indexOf(name);
      if (index !== -1) {
        names.splice(index, 1);
        updateDependencies();
      }
    }
  };

  return Player;
});
