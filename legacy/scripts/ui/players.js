/**
 * Maintain a sorted list of possible player names for autocompletion
 *
 * @return Players
 * @implements ../backend/blobber
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./shared'], function(Shared) {
  var Players, names;

  names = [];

  Players = {};

  function trimName(name) {
    return name.replace(/^\s*|\s*$|\n|\r/g, '').replace(/\s\s*/g, ' ');
  }

  function updateDependencies() {
    Shared.Autocomplete.update();
  }

  Players.fromString = function(string) {
    var lines, name;

    lines = string.split('\n');

    // strip the names from white spaces
    // also, remove comments
    for (name in lines) {
      lines[name] = trimName(lines[name]).replace(/^#.*/, '');
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

  Players.toString = function() {
    return names.join('\n');
  };

  Players.fromBlob = function(blob) {
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

  Players.toBlob = function() {
    return JSON.stringify(names);
  };

  Players.clear = function() {
    names.slice(0);

    updateDependencies();
  };

  Players.reset = Players.clear;

  Players.get = function() {
    return names.slice();
  };

  Players.insert = function(name) {
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

  Players.erase = function(name) {
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

  Shared.Players = Players;
  return Players;
});
