/**
 * Unit Tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingModel, MatchResult, MatchModel, Options, CorrectionModel;

    RankingModel = getModule('ranking/rankingmodel');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');
    CorrectionModel = getModule('core/correctionmodel');
    Options = getModule('options');

    QUnit.test('TwoPoint Ranking', function (assert) {
      var ranking, ret, ref;

      ranking = new RankingModel(['twopoint', 'wins', 'points'], 5);

      assert.equal(ranking.dataListeners.twopoint.isPrimary(), true,
          'twopoint is a primary dataListener');

      ref = {
        components: ['twopoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        twopoint: [0, 0, 0, 0, 0],
        wins: [0, 0, 0, 0, 0],
        points: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'empty ranking: correct TwoPoint score');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [8, 3]));
      ref = {
        components: ['twopoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        twopoint: [0, 3, 0, 0, 0],
        wins: [0, 1, 0, 0, 0],
        points: [0, 8, 0, 3, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'win for A yields 3 points');

      ranking.result(new MatchResult(new MatchModel([0, 2], 0, 1), [0, 8]));
      ref = {
        components: ['twopoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [3, 0, 0, 2, 3],
        displayOrder: [1, 2, 3, 0, 4],
        twopoint: [0, 3, 3, 0, 0],
        wins: [0, 1, 1, 0, 0],
        points: [0, 8, 8, 3, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'win for B yields 3 points');

      ranking.result(new MatchResult(new MatchModel([4, 3], 0, 2), [3, 3]));
      ref = {
        components: ['twopoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 0, 0, 2, 3],
        displayOrder: [1, 2, 3, 4, 0],
        twopoint: [0, 3, 3, 1, 1],
        wins: [0, 1, 1, 0, 0],
        points: [0, 8, 8, 6, 3]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'draw yields 1 point each');

      ranking.correct(new CorrectionModel(
        new MatchResult(new MatchModel([4, 3], 0, 2), [3, 3]),
        new MatchResult(new MatchModel([4, 3], 0, 2), [3, 8])
      ));
      ref = {
        components: ['twopoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 1, 1, 0, 3],
        displayOrder: [3, 1, 2, 4, 0],
        twopoint: [0, 3, 3, 3, 0],
        wins: [0, 1, 1, 1, 0],
        points: [0, 8, 8, 11, 3]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'corrections work');
    });
  };
});
