/**
 * Load and manage all tabs centrally
 */

define([ './tab_history', './tab_ranking', './tab_storage', './tab_new',
    './tab_teams', './tab_games' ], function () {
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

// TODO EVERYWHERE: prevent default behavior!
