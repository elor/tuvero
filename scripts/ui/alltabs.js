/**
 * Load and manage all tabs centrally
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ './shared', './tab_history', './tab_ranking', './tab_new', './tab_teams',
    './tab_games', './tab_debug', './tab_settings' ], function (Shared) {
  var tab, tabs, Alltabs;

  tabs = [];

  for (tab = 1; tab < arguments.length; tab += 1) {
    if (!arguments[tab]) {
      console.error('alltabs: argument id ' + tab + ' has invalid value: ');
      console.error(arguments[tab]);
      continue;
    }

    tabs[tab] = arguments[tab];
  }

  Alltabs = {
    reset : function () {
      var tab;
      for (tab in tabs) {
        tabs[tab].reset();
      }
    },
    update : function (force) {
      for (tab in tabs) {
        tabs[tab].update(force);
      }
    },
    getOptions : function () {
      return {};
    },
    setOptions : function () {
    },
  };

  Shared.Alltabs = Alltabs;
  return Alltabs;
});
