/*
 * Tab Test
 */
define([ 'lib/qunit', '../../lib/implements', '../../backend/blobber', '../state',
    '../players', '../tournaments', '../team', '../history' ], function (QUnit, Implements, Blobber, State, Players, Tournaments, Team, History) {
  QUnit.test("UI Blob tests", function () {

    QUnit.equal(Implements(Blobber), '', "Blobber is an interface");

    QUnit.equal(Implements(Blobber, Players), '', 'Players interface match');
    QUnit.equal(Implements(Blobber, State), '', 'Blob interface match');
    QUnit.equal(Implements(Blobber, Tournaments), '', 'Tournamentsinterface match');
    QUnit.equal(Implements(Blobber, Team), '', 'Team interface match');
    QUnit.equal(Implements(Blobber, History), '', 'History interface match');

  });
});
