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
define([], function() {
  var Options, Default, State;

  State = undefined;
  Default = {};
  Options = {};

  function getState() {
    return State || (State = require('ui/state_new'));
  }

  Options.toBlob = function() {
    Options.teamsize = getState().teamsize.get();
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

    // apply default options
    for (key in Default) {
      Options[key] = Default[key];
    }

    // reset everything
    for (key in opts) {
      Options[key] = opts[key];
    }

    if (Options.teamsize) {
      getState().teamsize.set(Options.teamsize);
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
