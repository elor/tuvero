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

    QUnit.test('ThreePoint Ranking', function (assert) {
      var ranking, ret, ref;

      ranking = new RankingModel(['threepoint', 'wins', 'points'], 4);

      assert.equal(ranking.dataListeners.threepoint.isPrimary(), true,
          'threepoint is a primary dataListener');

      ref = {
        components: ['threepoint', 'wins', 'points'],
        ids: [0, 1, 2, 3],
        ranks: [0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3],
        wins: [0, 0, 0, 0],
        points: [0, 0, 0, 0],
        threepoint: [0, 0, 0, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'empty ranking: correct ThreePoint score');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [8, 3]));
      ref = {
        components: ['threepoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        wins: [0, 1, 0, 0, 0],
        points: [0, 8, 0, 3, 0],
        threepoint: [0, 3, 0, 0, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'win for A yields 3 points');

      ranking.result(new MatchResult(new MatchModel([0, 2], 0, 0), [0, 8]));
      ref = {
        components: ['threepoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [3, 0, 0, 2, 3],
        displayOrder: [1, 2, 3, 0, 4],
        wins: [0, 1, 1, 0, 0],
        points: [0, 8, 8, 3, 0],
        threepoint: [0, 3, 3, 0, 0]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'win for B yields 3 points');

      ranking.result(new MatchResult(new MatchModel([4, 3], 0, 0), [3, 3]));
      ref = {
        components: ['threepoint', 'wins', 'points'],
        ids: [0, 1, 2, 3, 4],
        ranks: [4, 0, 0, 2, 3],
        displayOrder: [1, 2, 3, 4, 0],
        wins: [0, 1, 1, 0, 0],
        points: [0, 8, 8, 6, 3],
        threepoint: [0, 3, 3, 1, 1]
      };
      ret = ranking.get();
      assert.deepEqual(ret, ref, 'draw yields 1 point each');
    });
  };
});
