/**
 * Load and manage all tabs centrally
 */

define([ './tab_games', './tab_history', './tab_new', './tab_ranking',
    './tab_storage', './tab_teams' ], function () {
  var i, tabs, Alltabs;

  tabs = [];

  for (i = 0; i < arguments.size(); i += 1) {
    tabs[i] = $arguments;
  }

  Alltabs = {
    reset : function () {
      var i;
      for (i in tabs) {
        tabs[i].reset();
      }
    },
    update : function () {
      for (i in tabs) {
        tabs[i].update();
      }
    }
  };
});
