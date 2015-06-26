/**
 * RankingModel class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingModel, MatchResult, MatchModel;

    RankingModel = getModule('core/rankingmodel');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');

    QUnit.test('Sonneborn-Berger Ranking', function() {
      var ranking, result, ret, ref;

      ranking = new RankingModel(['wins', 'sonneborn'], 5);
      ref = {
        components: ['wins', 'sonneborn'],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        sonneborn: [0, 0, 0, 0, 0],
        wins: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'empty ranking: correct SB-score');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 7]));
      ref = {
        components: ['wins', 'sonneborn'],
        ranks: [1, 0, 1, 1, 1],
        displayOrder: [1, 0, 2, 3, 4],
        sonneborn: [0, 0, 0, 0, 0],
        wins: [0, 1, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'first ranking is correct');

      ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [0, 11]));
      ret = ranking.get();
      ref = {
        components: ['wins', 'sonneborn'],
        ranks: [2, 0, 2, 2, 0],
        displayOrder: [1, 4, 0, 2, 3],
        sonneborn: [0, 0, 0, 0, 0],
        wins: [0, 1, 0, 0, 1]
      };
      QUnit.deepEqual(ret, ref, 'second ranking is correct');

      ranking.result(new MatchResult(new MatchModel([1, 4], 0, 0), [13, 12]));
      ref = {
        components: ['wins', 'sonneborn'],
        ranks: [2, 0, 2, 2, 1],
        displayOrder: [1, 4, 0, 2, 3],
        sonneborn: [0, 1, 0, 0, 0],
        wins: [0, 2, 0, 0, 1]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'third ranking is correct');

      ranking.result(new MatchResult(new MatchModel([1, 2], 0, 0), [5, 13]));
      ranking.result(new MatchResult(new MatchModel([3, 0], 0, 0), [13, 0]));
      ranking.result(new MatchResult(new MatchModel([4, 2], 0, 0), [11, 13]));
      ref = {
        components: ['wins', 'sonneborn'],
        ranks: [4, 1, 0, 2, 2],
        displayOrder: [2, 1, 3, 4, 0],
        sonneborn: [0, 2, 3, 0, 0],
        wins: [0, 2, 2, 1, 1]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'final ranking is correct');

      // TODO correct
    });
  };
});
