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
      QUnit.ok(TournamentIndex.createTournament('swiss'), 'swiss');
      QUnit.equal(TournamentIndex.createTournament('ko'), undefined,//
      'ko fails');
      QUnit.equal(TournamentIndex.createTournament('poule'), undefined,
          'poule fails');

      QUnit.equal(TournamentIndex.createTournament({}), undefined,
          'savedata-passing without "sys" property fails');
      QUnit.ok(TournamentIndex.createTournament({
        sys: 'round'
      }), 'round-tournament with savedata');
      QUnit.equal(TournamentIndex.createTournament({
        sys: 'poule'
      }), undefined, 'poule-tournament with savedata fails');

    });
  };
});
