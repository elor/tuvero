/**
 * returns an object with options, such as number of players, tournament name,
 * ...
 */

define(function () {
  var Options, Default;

  Options = {};

  Default = {
    // installation-specific
    // global : {},
    playernameurl : 'https://boulesdb.appspot.com/json',
    maxteamsize : 3,
    maxpoints : 15,
    // user-specific
    // local : {},
    dbname : 'swiss',
    dbplayername : 'players',
    roundtries : 20,
    // tournament-specific
    // tournament : {},
    teamsize : 3,
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
