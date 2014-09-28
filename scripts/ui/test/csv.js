/*
 * Tab Test
 */
define(function () {
  return function (QUnit, require) {
    var Implements, CSVer, Team, History, Ranking;

    Implements = require('lib/implements');
    CSVer = require('ui/csver');
    Team = require('ui/team');
    History = require('ui/history');
    Ranking = require('ui/ranking');

    QUnit.test("UI CSV tests", function () {
      QUnit.equal(Implements(CSVer), '', "CSVer is an interface");

      QUnit.equal(Implements(CSVer, Team), '', 'Team interface match');
      QUnit.equal(Implements(CSVer, History), '', 'History interface match');
      QUnit.equal(Implements(CSVer, Ranking), '', 'Ranking interface match');
    });
  };
});
