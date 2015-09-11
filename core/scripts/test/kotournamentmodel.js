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
    var extend, KOTournamentModel, TournamentModel;

    extend = getModule('lib/extend');
    KOTournamentModel = getModule('core/kotournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');

    QUnit.test('KOTournamentModel', function() {
      var ids, result, ref, tournament;

      QUnit.ok(extend.isSubclass(KOTournamentModel, TournamentModel),
          'KOTournamentModel is subclass of TournamentModel');

      ids = [];
      while (ids.length <= 33) {
        ids.push(ids.length);
      }

      /*
       * Tree traversal functions
       */
      result = ids.map(function(id) {
        return KOTournamentModel.ceilPowerOfTwo(id);
      });
      ref = [1, 1, 2, 4, 4, 8, 8, 8, 8, 16, 16, 16, 16, 16, 16, 16, 16, 32, 32,
          32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 64];
      QUnit.deepEqual(result, ref, 'ceilPowerOfTwo()');

      result = ids.map(function(id) {
        return KOTournamentModel.nextRoundMatchID(id);
      });
      ref = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10,
          10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16];
      QUnit.deepEqual(result, ref, 'nextRoundMatchID()');

      result = ids.map(function(id) {
        return KOTournamentModel.isSecondInNextRound(id);
      });
      ref = [false, false, false, true, false, true, false, true, false, true,
          false, true, false, true, false, true, false, true, false, true,
          false, true, false, true, false, true, false, true, false, true,
          false, true, false, true];
      QUnit.deepEqual(result, ref, 'isSecondInNextRound()');

      result = ids.map(function(id) {
        return KOTournamentModel.complementaryMatchID(id);
      });
      ref = [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17, 16, 19,
          18, 21, 20, 23, 22, 25, 24, 27, 26, 29, 28, 31, 30, 33, 32];
      QUnit.deepEqual(result, ref, 'complementaryMatchID()');

      result = ids.slice(0, 16).map(function(id) {
        return KOTournamentModel.firstMatchIDOfRound(id);
      });
      ref = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192,
          16384, 32768];
      QUnit.deepEqual(result, ref, 'firstMatchIDOfRound()');

      result = ids.slice(0, 16).map(function(id) {
        return KOTournamentModel.numMatchesInRound(id);
      });
      ref = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192,
          16384, 32768];
      QUnit.deepEqual(result, ref, 'numMatchesInRound()');

      result = ids.map(function(id) {
        return KOTournamentModel.roundOfMatchID(id);
      });
      ref = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5];
      QUnit.deepEqual(result, ref, 'roundOfMatchID()');

      result = ids.map(function(id) {
        return KOTournamentModel.loserGroupID(0, id);
      });
      ref = [0, 0, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8,
          8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16];
      QUnit.deepEqual(result, ref, 'loserGroupID(0)');

      result = ids.map(function(id) {
        return KOTournamentModel.loserGroupID(8, id);
      });
      ref = ref.map(function(a) {
        return a + 8;
      });
      QUnit.deepEqual(result, ref, 'loserGroupID(8)');

      result = ids.map(function(id) {
        return KOTournamentModel.initialRoundForTeams(id);
      });
      ref = [-1, -1, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5];
      QUnit.deepEqual(result, ref, 'loserGroupID()');

      result = ids.map(function(id) {
        return KOTournamentModel.roundsInGroup(id);
      });
      ref = [30, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1,
          2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1];
      QUnit.deepEqual(result, ref, 'roundsInGroup()');

      result = ids.map(function(id) {
        return KOTournamentModel.parentGroup(id);
      });
      ref = [0, 0, 0, 2, 0, 4, 4, 6, 0, 8, 8, 10, 8, 12, 12, 14, 0, 16, 16, 18,
          16, 20, 20, 22, 16, 24, 24, 26, 24, 28, 28, 30, 0, 32];
      QUnit.deepEqual(result, ref, 'parentGroup()');

      /*
       * initial matches
       */
      tournament = new KOTournamentModel();
      tournament.addTeam(0);
      tournament.addTeam(1);
      tournament.addTeam(2);

      QUnit.ok(tournament.run(), 'run() with 3 teams succeeds');
      QUnit.equal(tournament.getProperty('komode'), 'matched',
          'initial ko mode is "matched"');
      QUnit.equal(tournament.getHistory().length, 1, '1 match in the history');
      QUnit.equal(tournament.getMatches().length, 3, '3 running matches');
      QUnit.ok(tournament.getHistory().get(0), 'history match is a bye');
      QUnit.equal(tournament.getMatches().get(0).isResult(), false,
          'running match is running');
      QUnit.equal(tournament.getHistory().get(0).getID(), 2, 'id of bye is 2');
      QUnit.equal(tournament.getMatches().get(1).getID(), 3,
          'id of first running match is 1');
      QUnit.equal(tournament.getMatches().get(1).getID(), 3,
          'id of second running match is 3');

    });
  };
});
