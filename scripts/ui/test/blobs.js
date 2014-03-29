/*
 * Tab Test
 */
define([ '../../lib/implements', '../../backend/blobber', '../blob',
    '../players', '../swiss', '../team', '../history' ], function (Implements, Blobber, Blob, Players, Swiss, Team, History) {
  QUnit.test("UI Blob tests", function () {

    QUnit.equal(Implements(Blobber), '', "Blobber is an interface");

    QUnit.equal(Implements(Blobber, Players), '', 'Players interface match');
    QUnit.equal(Implements(Blobber, Blob), '', 'Blob interface match');
    QUnit.equal(Implements(Blobber, Swiss), '', 'Swiss interface match');
    QUnit.equal(Implements(Blobber, Team), '', 'Team interface match');
    QUnit.equal(Implements(Blobber, History), '', 'History interface match');

  });
});
