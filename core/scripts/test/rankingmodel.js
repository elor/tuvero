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
    var RankingModel, Model, extend;

    RankingModel = getModule('core/rankingmodel');
    Model = getModule('core/model');
    extend = getModule('lib/extend');

    QUnit.test('RankingModel', function() {
      var ranking, result;

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

      // TODO result()
      // TODO get()
      // TODO use GameResult or something
    });
  };
});
