/**
 * central options object. Please require 'options' instead of 'ui/options' to
 * ensure the target-specific Default options.
 *
 * TODO MVC-rewrite with multiple levels of default values
 *
 * TODO don't store the whole options object in localStorage
 *
 * @return Opts
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['ui/state_new'], function(State) {
  var Options, Default;

  Default = {};
  Options = {};

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

  Options.setDefault = function(newDefault) {
    Default = newDefault;
  };

  Options.reset = function() {
    // just use available functions instead of cloning
    Options.fromBlob(JSON.stringify(Default));
  };

  Options.reset();

  return Options;
});
