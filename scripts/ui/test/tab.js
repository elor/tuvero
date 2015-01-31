/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * Tab Test
 */
define(function() {
  return function(QUnit, getModule) {
    var Implements, Tab, Tab_Games, Tab_History, Tab_Ranking, Tab_Settings, Tab_Teams, Tab_New, Autocomplete, Alltabs, Tab_Debug;

    Implements = getModule('lib/implements');
    Tab = getModule('ui/tab');
    Tab_Games = getModule('ui/tab_games');
    Tab_History = getModule('ui/tab_history');
    Tab_Ranking = getModule('ui/tab_ranking');
    Tab_Settings = getModule('ui/tab_settings');
    Tab_Teams = getModule('ui/tab_teams');
    Tab_New = getModule('ui/tab_new');
    Autocomplete = getModule('ui/autocomplete');
    Alltabs = getModule('ui/alltabs');
    Tab_Debug = getModule('ui/tab_debug');

    QUnit.test('Tab Implements', function() {

      QUnit.equal(Implements(Tab), '', 'Tab is an interface');

      QUnit.equal(Implements(Tab, Tab_Games, 'frm'), '', 'Tab_Games interface match');
      QUnit.equal(Implements(Tab, Tab_History, 'frm'), '', 'Tab_History interface match');
      QUnit.equal(Implements(Tab, Tab_Ranking, 'frm'), '', 'Tab_Ranking interface match');
      QUnit.equal(Implements(Tab, Tab_Settings, 'frm'), '', 'Tab_Settings interface match');
      QUnit.equal(Implements(Tab, Tab_Teams, 'frm'), '', 'Tab_Teams interface match');
      QUnit.equal(Implements(Tab, Tab_New, 'frm'), '', 'Tab_New interface match');
      QUnit.equal(Implements(Tab, Tab_Debug, 'frm'), '', 'Tab_Debug interface match');
      QUnit.equal(Implements(Tab, Alltabs, 'frm'), '', 'Alltabs interface match');

      QUnit.equal(Implements({
        Interface: {
          clear: function() {
          },
          reset: function() {
          },
          update: function() {
          }
        }
      }, Autocomplete, 'frm'), '', 'Autocomplete interface match');
    });
  };
});
