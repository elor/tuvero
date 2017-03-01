/**
 * Unit Tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingModel, MatchResult, MatchModel, Options, CorrectionModel;

    RankingModel = getModule('core/rankingmodel');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');
    CorrectionModel = getModule('core/correctionmodel');
    Options = getModule('options');

    QUnit.test('TAC Ranking', function() {
      var ranking, result, ret, ref, optionbak;

      /*
       * adjust options to fit typical TAC options
       */
      optionbak = {
        byepointswon: Options.byepointswon,
        byepointslost: Options.byepointslost,
        maxpoints: Options.maxpoints
      };
      Options.byepointswon = 8;
      Options.byepointslost = 6;
      Options.maxpoints = 8;

      ranking = new RankingModel(['tac', 'wins', 'points'], 5);

      QUnit.equal(ranking.dataListeners.tac.isPrimary(), true,
          'tac is a primary dataListener');

      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        wins: [0, 0, 0, 0, 0],
        points: [0, 0, 0, 0, 0],
        tac: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'empty ranking: correct TAC score');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [8, 7]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        wins: [0, 1, 0, 0, 0],
        points: [0, 8, 0, 7, 0],
        tac: [0, 13, 0, 7, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'first ranking is correct');

      ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [0, 8]));
      ret = ranking.get();
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [3, 1, 4, 2, 0],
        displayOrder: [4, 1, 3, 0, 2],
        wins: [0, 1, 0, 0, 1],
        points: [0, 8, 0, 7, 8],
        tac: [1, 13, 0, 7, 20]
      };
      QUnit.deepEqual(ret, ref, 'second ranking is correct (0 -> 1)');

      ranking.result(new MatchResult(new MatchModel([1, 4], 0, 0), [8, 5]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [3, 0, 4, 2, 1],
        displayOrder: [1, 4, 3, 0, 2],
        wins: [0, 2, 0, 0, 1],
        points: [0, 16, 0, 7, 13],
        tac: [1, 28, 0, 7, 25]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'third ranking is correct');

      ranking.result(new MatchResult(new MatchModel([1, 2], 0, 0), [3, 8]));
      ranking.result(new MatchResult(new MatchModel([3, 0], 0, 0), [8, 0]));
      ranking.result(new MatchResult(new MatchModel([4, 2], 0, 0), [8, 6]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 1, 3, 2, 0],
        displayOrder: [4, 1, 3, 2, 0],
        wins: [0, 2, 1, 1, 2],
        points: [0, 19, 14, 15, 21],
        tac: [2, 31, 23, 27, 39]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'final ranking is correct');

      ranking.result(new MatchResult(new MatchModel([0, 2], 0, 0), [7, 6]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 1, 2, 3, 0],
        displayOrder: [4, 1, 2, 3, 0],
        wins: [1, 2, 1, 1, 2],
        points: [7, 19, 20, 15, 21],
        tac: [9, 31, 29, 27, 39]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'aborted game points are saldo only');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [5, 5]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 1, 3, 2, 0],
        displayOrder: [4, 1, 3, 2, 0],
        wins: [1, 2, 1, 1, 2],
        points: [7, 24, 20, 20, 21],
        tac: [9, 36, 29, 32, 39]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'aborted game points, equal');

      /*
       * correct()
       */
      ranking.correct(new CorrectionModel(//
      new MatchResult(new MatchModel([0, 2], 0, 0), [7, 6]),//
      new MatchResult(new MatchModel([0, 2], 0, 0), [5, 8])//
      ));
      ref = {
        components: ['tac', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 2, 1, 3, 0],
        displayOrder: [4, 2, 1, 3, 0],
        wins: [0, 2, 2, 1, 2],
        points: [5, 24, 22, 20, 21],
        tac: [7, 36, 38, 32, 39]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'correct() works correctly with TAC');

      // undo a correct by correcting again. Should yield the same result.
      ranking = new RankingModel(['tac'], 2);
      ranking.result(new MatchResult(new MatchModel([0, 1], 0, 0), [8, 0]));
      ref = ranking.get();
      ranking.correct(new CorrectionModel(//
      new MatchResult(new MatchModel([0, 1], 0, 0), [8, 0]),//
      new MatchResult(new MatchModel([0, 1], 0, 0), [8, 7])//
      ));
      ranking.correct(new CorrectionModel(//
      new MatchResult(new MatchModel([0, 1], 0, 0), [8, 7]),//
      new MatchResult(new MatchModel([0, 1], 0, 0), [8, 0])//
      ));
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'undo a correction yields original result'
          + ' ("one point for 0:8" is undone correctly)');

      /*
       * bye
       */
      ranking = new RankingModel(['tac'], 2);
      ranking.bye(1);
      ref = {
        components: ['tac'],
        ids: [0, 1],
        ranks: [1, 0],
        displayOrder: [1, 0],
        tac: [0, 12 + Options.byepointswon - Options.byepointslost]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'tac accepts byes');

      ranking.bye(1);
      ref.tac[1] *= 2;
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'tac accepts multiple byes');

      /*
       * restore original options
       */
      Options.byepointswon = optionbak.byepointswon;
      Options.byepointslost = optionbak.byepointslost;
      Options.maxpoints = optionbak.maxpoints;
    });
  };
});
