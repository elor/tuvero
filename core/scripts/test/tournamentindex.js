/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var TournamentIndex;

    TournamentIndex = getModule('core/tournamentindex');

    QUnit.test('TournamentIndex', function() {
      QUnit.equal(TournamentIndex.createTournament(), undefined,
          'empty construction fails');
      QUnit.equal(TournamentIndex.createTournament('undefined'), undefined,
          'undefined fails');
      QUnit.ok(TournamentIndex.createTournament('round'), 'round');
      QUnit.equal(TournamentIndex.createTournament('swiss'), undefined,
          'swiss fails');
    });
  };
});
