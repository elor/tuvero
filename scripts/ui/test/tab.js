/*
 * Tab Test
 */
define([ '../../lib/interface', '../tab', '../tab_games', '../tab_history',
    '../tab_ranking', '../tab_storage', '../tab_teams' ], function (Interface, Tab, Tab_Games, Tab_History, Tab_Ranking, Tab_Storage, Tab_Teams) {
  QUnit.test("Tab Interfaces", function () {

    QUnit.equal(Interface(Tab), '', "Tab is an interface");

    QUnit.equal(Interface(Tab, Tab_Games, 'frm'), '', "Tab_Games interface match");
    QUnit.equal(Interface(Tab, Tab_History, 'frm'), '', "Tab_History interface match");
    QUnit.equal(Interface(Tab, Tab_Ranking, 'frm'), '', "Tab_Ranking interface match");
    QUnit.equal(Interface(Tab, Tab_Storage, 'frm'), '', "Tab_Storage interface match");
    QUnit.equal(Interface(Tab, Tab_Teams, 'frm'), '', "Tab_Teams interface match");
  });
});
