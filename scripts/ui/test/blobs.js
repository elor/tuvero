/*
 * Tab Test
 */
define([ '../../lib/implements', '../../backend/blobber', '../state',
    '../players', '../swiss', '../team', '../history' ], function (Implements, Blobber, State, Players, Swiss, Team, History) {
  QUnit.test("UI Blob tests", function () {

    QUnit.equal(Implements(Blobber), '', "Blobber is an interface");

    QUnit.equal(Implements(Blobber, Players), '', 'Players interface match');
    QUnit.equal(Implements(Blobber, State), '', 'Blob interface match');
    QUnit.equal(Implements(Blobber, Swiss), '', 'Swiss interface match');
    QUnit.equal(Implements(Blobber, Team), '', 'Team interface match');
    QUnit.equal(Implements(Blobber, History), '', 'History interface match');

  });
});
