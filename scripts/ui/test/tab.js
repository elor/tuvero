/*
 * Tab Test
 */
define([ '../../lib/implements', '../tab', '../tab_games', '../tab_history',
    '../tab_ranking', '../tab_storage', '../tab_teams', '../tab_new',
    '../autocomplete', '../alltabs', '../tab_debug' ], function (Implements, Tab, Tab_Games, Tab_History, Tab_Ranking, Tab_Storage, Tab_Teams, Tab_New, Autocomplete, AllTabs, Tab_Debug) {
  QUnit.test("Tab Implements", function () {

    QUnit.equal(Implements(Tab), '', "Tab is an interface");

    QUnit.equal(Implements(Tab, Tab_Games, 'frm'), '', "Tab_Games interface match");
    QUnit.equal(Implements(Tab, Tab_History, 'frm'), '', "Tab_History interface match");
    QUnit.equal(Implements(Tab, Tab_Ranking, 'frm'), '', "Tab_Ranking interface match");
    QUnit.equal(Implements(Tab, Tab_Storage, 'frm'), '', "Tab_Storage interface match");
    QUnit.equal(Implements(Tab, Tab_Teams, 'frm'), '', "Tab_Teams interface match");
    QUnit.equal(Implements(Tab, Tab_New, 'frm'), '', "Tab_New interface match");
    QUnit.equal(Implements(Tab, Tab_Debug, 'frm'), '', "Tab_Debug interface match");
    QUnit.equal(Implements(Tab, AllTabs, 'frm'), '', "AllTabs interface match");

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
});
