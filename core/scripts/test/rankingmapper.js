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
    var extend, RankingMapper, Model, RankingModel, MatchResult, ListModel, Listener;

    extend = getModule('lib/extend');
    ListModel = getModule('core/listmodel');
    RankingModel = getModule('core/rankingmodel');
    RankingMapper = getModule('core/rankingmapper');
    MatchResult = getModule('core/matchresult');
    Model = getModule('core/model');
    Listener = getModule('core/listener');

    QUnit.test('RankingMapper', function(teams) {
      var internal, ranking, result, listener;

      QUnit.ok(extend.isSubclass(RankingMapper, Model),
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
        ranks: [0, 0, 0, 0, 0],
        displayOrder: [5, 4, 3, 2, 1],
        wins: [0, 0, 0, 0, 0],
        saldo: [0, 0, 0, 0, 0]
      };
      QUnit.deepEqual(ranking.get(), ref,
          'external displayOrder before first result');

      internal.result(new MatchResult([1, 2], [13, 7]));

      ref = {
        components: ['wins', 'saldo'],
        ranks: [1, 0, 4, 1, 1],
        displayOrder: [4, 5, 2, 1, 3],
        wins: [0, 1, 0, 0, 0],
        saldo: [0, 6, -6, 0, 0]
      };
      QUnit.deepEqual(ranking.get(), ref,
          'external displayOrder after first result');

      listener = new Listener(ranking);
      listener.onupdate = function(emitter) {
        var reference;

        this.success = true;

        reference = {
          components: ['wins', 'saldo'],
          ranks: [2, 0, 0, 2, 4],
          displayOrder: [4, 3, 5, 2, 1],
          wins: [0, 1, 1, 0, 0],
          saldo: [0, 6, 6, 0, -12]
        };
        QUnit.equal(emitter, ranking,
            'callback: emitter is ranking (safety check)');
        QUnit.deepEqual(emitter.get(), reference,
            'external displayOrder after second result, inside callback');

      };

      internal.result(new MatchResult([2, 4], [13, 1]));

      QUnit.ok(listener.success, 'RankingMapper emits update events');

      ref = {
        components: ['wins', 'saldo'],
        ranks: [2, 0, 0, 2, 4],
        displayOrder: [4, 3, 5, 2, 1],
        wins: [0, 1, 1, 0, 0],
        saldo: [0, 6, 6, 0, -12]
      };
      QUnit.deepEqual(ranking.get(), ref,
          'external displayOrder after second result, outside of callback');

    });
  };
});
