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
      var ids, result, ref;
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
      ref = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5];
      QUnit.deepEqual(result, ref, 'loserGroupID()');

      result = ids.map(function(id) {
        return KOTournamentModel.loserGroupID(8, id);
      });
      ref = [8, 8, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 12,
          12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13];
      QUnit.deepEqual(result, ref, 'loserGroupID()');

      result = ids.map(function(id) {
        return KOTournamentModel.initialRoundForTeams(id);
      });
      ref = [-1, -1, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5];
      QUnit.deepEqual(result, ref, 'loserGroupID()');

    });
  };
});
