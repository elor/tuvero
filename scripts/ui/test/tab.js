/*
 * Tab Test
 */
define(function () {
  return function (QUnit) {
    var Implements, Tab, Tab_Games, Tab_History, Tab_Ranking, Tab_Settings, Tab_Teams, Tab_New, Autocomplete, Alltabs, Tab_Debug;

    Implements = require('lib/implements');
    Tab = require('ui/tab');
    Tab_Games = require('ui/tab_games');
    Tab_History = require('ui/tab_history');
    Tab_Ranking = require('ui/tab_ranking');
    Tab_Settings = require('ui/tab_settings');
    Tab_Teams = require('ui/tab_teams');
    Tab_New = require('ui/tab_new');
    Autocomplete = require('ui/autocomplete');
    Alltabs = require('ui/alltabs');
    Tab_Debug = require('ui/tab_debug');

    QUnit.test("Tab Implements", function () {

      QUnit.equal(Implements(Tab), '', "Tab is an interface");

      QUnit.equal(Implements(Tab, Tab_Games, 'frm'), '', "Tab_Games interface match");
      QUnit.equal(Implements(Tab, Tab_History, 'frm'), '', "Tab_History interface match");
      QUnit.equal(Implements(Tab, Tab_Ranking, 'frm'), '', "Tab_Ranking interface match");
      QUnit.equal(Implements(Tab, Tab_Settings, 'frm'), '', "Tab_Settings interface match");
      QUnit.equal(Implements(Tab, Tab_Teams, 'frm'), '', "Tab_Teams interface match");
      QUnit.equal(Implements(Tab, Tab_New, 'frm'), '', "Tab_New interface match");
      QUnit.equal(Implements(Tab, Tab_Debug, 'frm'), '', "Tab_Debug interface match");
      QUnit.equal(Implements(Tab, Alltabs, 'frm'), '', "Alltabs interface match");

      QUnit.equal(Implements({
        Interface : {
          clear : function () {
          },
          reset : function () {
          },
          update : function () {
          }
        }
      }, Autocomplete, 'frm'), '', "Autocomplete interface match");
    });
  };
});
