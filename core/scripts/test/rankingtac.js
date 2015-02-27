/**
 * Unit Tests
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingModel, GameResult;

    RankingModel = getModule('core/rankingmodel');
    GameResult = getModule('core/gameresult');

    QUnit.test('TAC Ranking', function() {
      var ranking, result, ret, ref;

      ranking = new RankingModel(['tac', 'wins', 'points'], 5);
      ref = {
        components: ['tac', 'wins', 'points'],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        wins: [0, 0, 0, 0, 0],
        points: [0, 0, 0, 0, 0],
        tac: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'empty ranking: correct TAC score');

      ranking.result(new GameResult([1, 3], [8, 7]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        wins: [0, 1, 0, 0, 0],
        points: [0, 8, 0, 7, 0],
        tac: [0, 13, 0, 7, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'first ranking is correct');

      ranking.result(new GameResult([0, 4], [0, 8]));
      ret = ranking.get();
      ref = {
        components: ['tac', 'wins', 'points'],
        ranks: [3, 1, 3, 2, 0],
        displayOrder: [4, 1, 3, 0, 2],
        wins: [0, 1, 0, 0, 1],
        points: [0, 8, 0, 7, 8],
        tac: [0, 13, 0, 7, 20]
      };
      QUnit.deepEqual(ret, ref, 'second ranking is correct');

      ranking.result(new GameResult([1, 4], [8, 5]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ranks: [3, 0, 3, 2, 1],
        displayOrder: [1, 4, 3, 0, 2],
        wins: [0, 2, 0, 0, 1],
        points: [0, 16, 0, 7, 13],
        tac: [0, 28, 0, 7, 25]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'third ranking is correct');

      ranking.result(new GameResult([1, 2], [3, 8]));
      ranking.result(new GameResult([3, 0], [8, 0]));
      ranking.result(new GameResult([4, 2], [8, 6]));
      ref = {
        components: ['tac', 'wins', 'points'],
        ranks: [4, 1, 3, 2, 0],
        displayOrder: [4, 1, 3, 2, 0],
        wins: [0, 2, 1, 1, 2],
        points: [0, 19, 14, 15, 21],
        tac: [0, 31, 23, 27, 39]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'final ranking is correct');

      // TODO correct
    });
  };
});
