/*
 * Tab Test
 */
define([ 'lib/qunit', '../../lib/implements', '../csver', '../team', '../history',
    '../ranking' ], function (QUnit, Implements, CSVer, Team, History, Ranking) {
  QUnit.test("UI CSV tests", function () {

    QUnit.equal(Implements(CSVer), '', "CSVer is an interface");

    QUnit.equal(Implements(CSVer, Team), '', 'Team interface match');
    QUnit.equal(Implements(CSVer, History), '', 'History interface match');
    QUnit.equal(Implements(CSVer, Ranking), '', 'Ranking interface match');
  });
});
