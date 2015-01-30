/**
 * Wrap all tabs into a single object for centralized updates
 * 
 * @exports Alltabs
 * @implements ./tab
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './shared', './tab_history', './tab_ranking', './tab_new',
    './tab_teams', './tab_games', './tab_debug', './tab_settings' ], function (
    Shared) {
  var tabid, tabs, Alltabs;

  tabs = [];

  for (tabid = 1; tabid < arguments.length; tabid += 1) {
    if (!arguments[tabid]) {
      console.error('alltabids: argument id ' + tabid + ' has invalid value');
      console.error(arguments[tabid]);
      continue;
    }

    tabs[tabid] = arguments[tabid];
  }

  Alltabs = {
    reset : function () {
      tabs.forEach(function (tab) {
        tab.reset();
      });
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
