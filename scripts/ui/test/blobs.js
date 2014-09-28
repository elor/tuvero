/*
 * Tab Test
 */
define(function () {
  return function (QUnit) {
    var Implements, Blobber, State, Players, Tournaments, Team, History;

    Implements = require('lib/implements');
    Blobber = require('backend/blobber');
    State = require('ui/state');
    Players = require('ui/players');
    Tournaments = require('ui/tournaments');
    Team = require('ui/team');
    History = require('ui/history');

    QUnit.test("UI Blob tests", function () {

      QUnit.equal(Implements(Blobber), '', "Blobber is an interface");

      QUnit.equal(Implements(Blobber, Players), '', 'Players interface match');
      QUnit.equal(Implements(Blobber, State), '', 'Blob interface match');
      QUnit.equal(Implements(Blobber, Tournaments), '', 'Tournamentsinterface match');
      QUnit.equal(Implements(Blobber, Team), '', 'Team interface match');
      QUnit.equal(Implements(Blobber, History), '', 'History interface match');

    });
  };
});
