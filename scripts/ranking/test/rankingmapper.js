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
    var extend, RankingMapper, Model, RankingModel, MatchResult, MatchModel, ListModel, Listener;

    extend = getModule('lib/extend');
    ListModel = getModule('list/listmodel');
    RankingModel = getModule('ranking/rankingmodel');
    RankingMapper = getModule('ranking/rankingmapper');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');
    Model = getModule('core/model');
    Listener = getModule('core/listener');

    QUnit.test('RankingMapper', function (assert) {
      var internal, ranking, listener, teams, ref;

      assert.ok(extend.isSubclass(RankingMapper, Model),
          'RankingMapper is subclass of Model');

      teams = new ListModel();
      teams.push(5);
      teams.push(4);
      teams.push(3);
      teams.push(2);
      teams.push(1);

      internal = new RankingModel(['wins', 'saldo'], teams.length);
      ranking = new RankingMapper(internal, teams);

      ref = {
        components: ['wins', 'saldo'],
        ids: [5, 4, 3, 2, 1],
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [0, 1, 2, 3, 4],
        wins: [0, 0, 0, 0, 0],
        saldo: [0, 0, 0, 0, 0]
      };
      assert.deepEqual(ranking.get(), ref,
          'only the ids get re-mapped to external ids, not the displayOrder');

      internal.result(new MatchResult(new MatchModel([1, 2], 0, 0), [13, 7]));

      ref = {
        components: ['wins', 'saldo'],
        ids: [5, 4, 3, 2, 1],
        ranks: [1, 0, 4, 1, 1],
        displayOrder: [1, 0, 3, 4, 2],
        wins: [0, 1, 0, 0, 0],
        saldo: [0, 6, -6, 0, 0]
      };
      assert.deepEqual(ranking.get(), ref, 'ids remapped after first result');

      listener = new Listener(ranking);
      listener.onupdate = function(emitter) {
        var reference;

        this.success = true;

        reference = {
          components: ['wins', 'saldo'],
          ids: [5, 4, 3, 2, 1],
          ranks: [2, 0, 0, 2, 4],
          displayOrder: [1, 2, 0, 3, 4],
          wins: [0, 1, 1, 0, 0],
          saldo: [0, 6, 6, 0, -12]
        };
        assert.equal(emitter, ranking,
            'callback: emitter is ranking (safety check)');
        assert.deepEqual(emitter.get(), reference,
            'ids remapped after second result, inside callback');
      };

      internal.result(new MatchResult(new MatchModel([2, 4], 0, 0), [13, 1]));

      assert.ok(listener.success, 'RankingMapper emits update events');

      ref = {
        components: ['wins', 'saldo'],
        ids: [5, 4, 3, 2, 1],
        ranks: [2, 0, 0, 2, 4],
        displayOrder: [1, 2, 0, 3, 4],
        wins: [0, 1, 1, 0, 0],
        saldo: [0, 6, 6, 0, -12]
      };
      assert.deepEqual(ranking.get(), ref,
          'ids remapped after second result, outside of callback');

    });
  };
});
