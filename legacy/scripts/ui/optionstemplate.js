/**
 * central options object. Please require 'options' instead of 'ui/optionsclass'
 * to ensure the target-specific Default options.
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
define(function() {
  var OptionsTemplate, Default, State;

  State = undefined;
  Default = {};
  OptionsTemplate = {};

  function getState() {
    return State || (State = require('ui/state_new'));
  }

  OptionsTemplate.toBlob = function() {
    return JSON.stringify(OptionsTemplate);
  };

  OptionsTemplate.fromBlob = function(blob) {
    var opts, key;
    opts = JSON.parse(blob);

    // delete everything
    for (key in OptionsTemplate) {
      if (typeof (OptionsTemplate[key]) !== 'function') {
        delete OptionsTemplate[key];
      }
    }

    // apply default options
    for (key in Default) {
      OptionsTemplate[key] = Default[key];
    }

    // reset everything
    for (key in opts) {
      OptionsTemplate[key] = opts[key];
    }
  };

  OptionsTemplate.setDefault = function(newDefault) {
    Default = newDefault;
  };

  OptionsTemplate.reset = function() {
    // just use available functions instead of cloning
    OptionsTemplate.fromBlob(JSON.stringify(Default));
  };

  OptionsTemplate.reset();

  return OptionsTemplate;
});