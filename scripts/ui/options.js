/**
 * returns an object with options, such as number of players, tournament name,
 * ...
 */

define(function () {
  var Options, Default;

  Options = {};

  Default = {
    teamsize : 3,
    maxteamsize : 3,
    maxpoints : 15,
    roundtries : 20,
    dbname : 'swiss',
    dbplayername : 'players',
    playernameurl : 'players.txt',
  };

  Options.toBlob = function () {
    return JSON.stringify(Options);
  };

  Options.fromBlob = function (blob) {
    var opts, key;
    opts = JSON.parse(blob);

    // delete everything
    for (key in Options) {
      if (typeof (Options[key]) !== 'function') {
        delete Options[key];
      }
    }

    // reset everything
    for (key in opts) {
      if (typeof (opts[key]) !== 'function') {
        Options[key] = opts[key];
      }
    }
  };

  Options.reset = function () {
    // just use available functions instead of cloning
    Options.fromBlob(JSON.stringify(Default));
  };

  Options.reset();

  return Options;
});
