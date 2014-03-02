/*
 * Tab Test
 */
define([ '../../lib/interface', '../tab', '../tab_games', '../tab_history',
    '../tab_ranking', '../tab_storage', '../tab_teams' ], function (Interface, Tab, Tab_Games, Tab_History, Tab_Ranking, Tab_Storage, Tab_Teams) {
  QUnit.test("Tab Interfaces", function () {

    QUnit.equal(Interface(Tab), true, "Tab is an interface");

    Interface.verbose(true);
    QUnit.equal(Interface(Tab, Tab_Games, 'frm'), true, "Tab_Games interface match");
    QUnit.equal(Interface(Tab, Tab_History, 'frm'), true, "Tab_History interface match");
    QUnit.equal(Interface(Tab, Tab_Ranking, 'frm'), true, "Tab_Ranking interface match");
    QUnit.equal(Interface(Tab, Tab_Storage, 'frm'), true, "Tab_Storage interface match");
    QUnit.equal(Interface(Tab, Tab_Teams, 'frm'), true, "Tab_Teams interface match");
  });
});
