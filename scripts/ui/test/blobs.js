/**
 * Unit tests for the Blobber interface
 * 
 * @returns a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var Implements, Blobber, State, Players, Tournaments, Team, History;

    Implements = getModule('lib/implements');
    Blobber = getModule('backend/blobber');
    State = getModule('ui/state');
    Players = getModule('ui/players');
    Tournaments = getModule('ui/tournaments');
    Team = getModule('ui/team');
    History = getModule('ui/history');

    QUnit.test("UI Blob tests", function () {

      QUnit.equal(Implements(Blobber), '', "Blobber is an interface");

      QUnit.equal(Implements(Blobber, Players), '', 'Players interface match');
      QUnit.equal(Implements(Blobber, State), '', 'Blob interface match');
      QUnit.equal(Implements(Blobber, Tournaments), '',
          'Tournamentsinterface match');
      QUnit.equal(Implements(Blobber, Team), '', 'Team interface match');
      QUnit.equal(Implements(Blobber, History), '', 'History interface match');

    });
  };
});
