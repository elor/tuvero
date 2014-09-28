/*
 * Tab Test
 */
define(function () {
  return function (QUnit, getModule) {
    var Implements, CSVer, Team, History, Ranking;

    Implements = getModule('lib/implements');
    CSVer = getModule('ui/csver');
    Team = getModule('ui/team');
    History = getModule('ui/history');
    Ranking = getModule('ui/ranking');

    QUnit.test("UI CSV tests", function () {
      QUnit.equal(Implements(CSVer), '', "CSVer is an interface");

      QUnit.equal(Implements(CSVer, Team), '', 'Team interface match');
      QUnit.equal(Implements(CSVer, History), '', 'History interface match');
      QUnit.equal(Implements(CSVer, Ranking), '', 'Ranking interface match');
    });
  };
});
