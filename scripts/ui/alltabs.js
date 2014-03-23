/**
 * Load and manage all tabs centrally
 */

// define([ './tab_games', './tab_history', './tab_new', './tab_ranking',
// './tab_storage', './tab_teams' ], function () {
define([ './tab_teams', './tab_games' ], function () {
  var i, tabs, Alltabs;

  tabs = [];

  for (i = 0; i < arguments.length; i += 1) {
    tabs[i] = arguments[i];
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

  return Alltabs;
});
