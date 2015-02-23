/**
 * RankingModel class tests
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

    QUnit.test('Head-to-Head Ranking', function() {
      var ranking, result, ret, ref;

      ranking = new RankingModel(['wins', 'headtohead'], 5);
      ref = {
        components: ['wins', 'headtohead'],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        wins: [0, 0, 0, 0, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'empty ranking: correct SB-score');

      ranking.result(new GameResult([1, 3], [7, 13]));
      ranking.result(new GameResult([1, 0], [13, 9]));
      ref = {
        components: ['wins', 'headtohead'],
        ranks: [2, 1, 2, 0, 2],
        displayOrder: [3, 1, 0, 2, 4],
        wins: [0, 1, 0, 1, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'first ranking is correct');

      ranking.result(new GameResult([0, 3], [13, 11]));
      ref = {
        components: ['wins', 'headtohead'],
        ranks: [1, 0, 3, 2, 3],
        displayOrder: [1, 0, 3, 2, 4],
        wins: [1, 1, 0, 1, 0]
      };
      ret = ranking.get();
      QUnit.deepEqual(ret, ref, 'cyclic ranking finishes');

      // TODO correct
    });
  };
});
