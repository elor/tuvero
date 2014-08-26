/**
 * Load and manage all tabs centrally
 */

define([ './tab_history', './tab_ranking', './tab_new',
    './tab_teams', './tab_games', './tab_debug', './tab_settings' ], function () {
  var tab, tabs, Alltabs;

  tabs = [];

  for (tab = 0; tab < arguments.length; tab += 1) {
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
    update : function () {
      for (tab in tabs) {
        tabs[tab].update();
      }
    },
    getOptions : function () {
      return {};
    },
    setOptions : function () {
    },
  };

  return Alltabs;
});

// TODO EVERYWHERE: prevent default behavtabor!
