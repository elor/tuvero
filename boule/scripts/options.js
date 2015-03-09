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
    playernameurl: 'https://boulesdb.appspot.com/json',
    minteamsize: 1,
    maxteamsize: 3,
    maxpoints: 15,
    // user-specific
    // local : {},
    dbname: 'boulestournament',
    dbplayername: 'bouleplayers',
    roundtries: 20,
    savefile: 'boule.json',
    csvfile: 'boule.csv',
    teamsizeicon: true
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
