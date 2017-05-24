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

    TournamentIndex = getModule('tournament/tournamentindex');

    QUnit.test('TournamentIndex', function (assert) {
      assert.equal(TournamentIndex.createTournament(), undefined,
          'empty construction fails');
      assert.equal(TournamentIndex.createTournament('undefined'), undefined,
          'undefined fails');
      assert.ok(TournamentIndex.createTournament('round'), 'round');
      assert.ok(TournamentIndex.createTournament('swiss'), 'swiss');
      assert.ok(TournamentIndex.createTournament('ko'), 'ko');
      assert.equal(TournamentIndex.createTournament('poule'), undefined,
          'poule fails');

      assert.equal(TournamentIndex.createTournament({}), undefined,
          'savedata-passing without "sys" property fails');
      assert.ok(TournamentIndex.createTournament({
        sys: 'round'
      }), 'round-tournament with savedata');
      assert.equal(TournamentIndex.createTournament({
        sys: 'poule'
      }), undefined, 'poule-tournament with savedata fails');

    });
  };
});
