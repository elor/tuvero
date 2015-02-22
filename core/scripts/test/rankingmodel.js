/**
 * RankingModel class tests
 *
 * @return RankingModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingModel, Model, extend, GameResult, Listener;

    RankingModel = getModule('core/rankingmodel');
    GameResult = getModule('core/gameresult');
    Listener = getModule('core/listener');
    Model = getModule('core/model');
    extend = getModule('lib/extend');

    QUnit.test('RankingModel', function() {
      var ranking, result, rankingobject, ref, listener;

      listener = new Listener();
      listener.reset = function() {
        this.updated = 0;
        this.numreset = 0;
        this.resized = 0;
      };
      listener.onupdate = function() {
        this.updated += 1;
      };
      listener.onreset = function() {
        this.numreset += 1;
      };
      listener.onresize = function() {
        this.resized += 1;
      };

      QUnit.ok(extend.isSubclass(RankingModel, Model),
          'RankingModel is a subclass of Model and, hence, Emitter');

      try {
        ranking = new RankingModel();
      } catch (e) {
        ranking = undefined;
      }
      QUnit.equal(ranking, undefined, 'empty initialization abort');

      try {
        ranking = new RankingModel([], 5);
      } catch (e) {
        ranking = undefined;
      }
      QUnit.equal(ranking, undefined, 'empty components abort');

      ranking = new RankingModel(['points'], 5);
      QUnit.ok(ranking, 'valid initializtion');
      QUnit.equal(ranking.length, 5, 'valid ranking size');

      try {
        ranking = new RankingModel(['points']);
      } catch (e) {
        ranking = undefined;
      }
      QUnit.equal(ranking, undefined, 'no size abort');

      ranking = new RankingModel(['numgames', 'wins', 'saldo', 'points'], 5);
      listener.reset();
      ranking.registerListener(listener);

      ref = {
        components: ['numgames', 'wins', 'saldo', 'points'],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        numgames: [0, 0, 0, 0, 0],
        wins: [0, 0, 0, 0, 0],
        saldo: [0, 0, 0, 0, 0],
        points: [0, 0, 0, 0, 0]
      };
      rankingobject = ranking.get();
      QUnit.ok(rankingobject, 'ranking.get works');
      QUnit.deepEqual(rankingobject, ref, 'empty ranking is not empty');

      ranking.result(new GameResult([1, 3], [13, 7]));
      ref = {
        components: ['numgames', 'wins', 'saldo', 'points'],
        ranks: [2, 0, 2, 1, 2],
        displayOrder: [1, 3, 0, 2, 4],
        numgames: [0, 1, 0, 1, 0],
        wins: [0, 1, 0, 0, 0],
        saldo: [0, 6, 0, -6, 0],
        points: [0, 13, 0, 7, 0]
      };

      rankingobject = ranking.get();
      QUnit.ok(rankingobject, 'ranking.get works');
      QUnit.deepEqual(rankingobject, ref, 'ranking is correct');
      QUnit.equal(listener.updated, 1, 'result(): update event fired');

      ref = rankingobject;

      listener.reset();
      ranking.invalidate();
      rankingobject = ranking.get();
      QUnit.ok(rankingobject !== ref, 'invalidate() triggers a recalculation');
      QUnit.equal(listener.updated, 1, 'invalidate(): update event fired');

      listener.reset();
      ranking.result(new GameResult([0, 4], [0, 11]));
      rankingobject = ranking.get();

      ref = {
        components: ['numgames', 'wins', 'saldo', 'points'],
        ranks: [3, 1, 4, 2, 0],
        displayOrder: [4, 1, 3, 0, 2],
        numgames: [1, 1, 0, 1, 1],
        wins: [0, 1, 0, 0, 1],
        saldo: [-11, 6, 0, -6, 11],
        points: [0, 13, 0, 7, 11]
      };
      QUnit.deepEqual(rankingobject, ref, 'second ranking is correct');
      QUnit.equal(listener.updated, 1, 'result(): update event fired');

      // TODO correct()
      // TODO reset()
      // TODO resize()
    });
  };
});
