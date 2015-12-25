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

    QUnit.test('Head-to-Head Ranking', function() {
      var ranking, result, ret, ref;

      ranking = new RankingModel(['wins', 'headtohead'], 5);
      ref = {
        components: ['wins', 'headtohead'],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        wins: [0, 0, 0, 0, 0],
        headtohead: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'empty ranking: correct H2H-score');

      ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [7, 13]));
      ranking.result(new MatchResult(new MatchModel([1, 0], 0, 0), [13, 9]));
      ref = {
        components: ['wins', 'headtohead'],
        ids: [0, 1, 2, 3, 4],
        ranks: [2, 1, 2, 0, 2],
        displayOrder: [3, 1, 0, 2, 4],
        wins: [0, 1, 0, 1, 0],
        headtohead: [0, 0, 0, 1, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'first ranking is correct');

      ranking.result(new MatchResult(new MatchModel([0, 3], 0, 0), [13, 11]));
      ref = {
        components: ['wins', 'headtohead'],
        ids: [0, 1, 2, 3, 4],
        ranks: [0, 0, 3, 0, 3],
        displayOrder: [0, 1, 3, 2, 4],
        wins: [1, 1, 0, 1, 0],
        headtohead: [1, 1, 0, 1, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'cyclic ranking finishes');

      // TODO correct
    });
  };
});
