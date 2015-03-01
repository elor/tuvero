/**
 * Options object, which contains options such as database keys, points, etc.
 *
 * @deprecated will be replaced with a new OptionsModel class or something
 *
 * @return Options
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['ui/state_new'], function(State) {
  var Options, Default;

  Options = {};

  Default = {
    // installation-specific
    // global : {},
    playernameurl: '',
    minteamsize: 1,
    maxteamsize: 1,
    maxpoints: 8,
    // user-specific
    // local : {},
    dbname: 'tactournament',
    dbplayername: 'tacplayers',
    roundtries: 20,
    savefile: 'tac.json',
    csvfile: 'tac.csv'
  // tournament-specific
  // tournament : {},
  };

  Options.toBlob = function() {
    Options.teamsize = State.teamsize.get();
    return JSON.stringify(Options);
  };

  Options.fromBlob = function(blob) {
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
      Options[key] = opts[key];
    }

    if (Options.teamsize) {
      State.teamsize.set(Options.teamsize);
      delete Options.teamsize;
    }
  };

  Options.reset = function() {
    // just use available functions instead of cloning
    Options.fromBlob(JSON.stringify(Default));
  };

  Options.reset();

  return Options;
});
