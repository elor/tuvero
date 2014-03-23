/**
 * returns an object with options, such as number of players, tournament name,
 * ...
 */

define(function () {
  var Options;

  Options = {
    teamsize : 2,
    maxteamsize : 3,
    maxpoints : 13,
    name : 'swiss',
    dbname : 'swiss',
    dbplayername : 'players'
  };

  Options.toBlob = function () {
    return JSON.stringify(Options);
  };

  Options.fromBlob = function (blob) {
    var opts, key;
    opts = JSON.parse(blob);

    for (key in Options) {
      if (typeof (Options[key]) !== 'function') {
        delete Options[key];
      }
    }

    for (key in opts) {
      if (typeof (opts[key]) !== 'function') {
        Options[key] = opts[key];
      }
    }
  };

  return Options;
});
