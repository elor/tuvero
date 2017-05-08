/**
 * RankingDataListenerIndex class tests
 *
 * @return RankingDataListenerIndex
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var RankingDataListenerIndex, Emitter, MatchResult, MatchModel;

    RankingDataListenerIndex = getModule('ranking/rankingdatalistenerindex');
    MatchResult = getModule('core/matchresult');
    MatchModel = getModule('core/matchmodel');
    Emitter = getModule('core/emitter');

    QUnit.test('RankingDataListenerIndex', function() {
      var names, listeners, dummyRanking, result, ref;

      dummyRanking = new Emitter();
      dummyRanking.length = 5;
      dummyRanking.EVENTS = {
        'result': true
      };

      names = [];
      listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking,
          names);
      QUnit.deepEqual(names, [], 'empty names: still valid input');
      QUnit.deepEqual(listeners, [], 'empty names: no listeners');

      names = ['points'];
      listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking,
          names);
      QUnit.deepEqual(names, ['points'], 'flat dependencies: valid names out');
      QUnit.deepEqual(listeners.length, 1, 'flat dependencies: one listener');
      QUnit.ok(dummyRanking.points, 'listener creates points field');
      QUnit.equal(dummyRanking.points.length, dummyRanking.length,
          'listener initializes points field size');
      QUnit.equal(dummyRanking.points, listeners[0].points,
          'dummyRanking and listener share the reference');

      result = new MatchResult(new MatchModel([1, 4], 0, 0), [13, 7]);
      dummyRanking.emit('result', result);

      ref = [0, 13, 0, 0, 7];
      QUnit.deepEqual(dummyRanking.points.asArray(), ref,
          'single result accepted');

      result = new MatchResult(new MatchModel([0, 1], 0, 0), [5, 11]);
      dummyRanking.emit('result', result);
      result = new MatchResult(new MatchModel([3, 2], 0, 0), [13, 0]);
      dummyRanking.emit('result', result);

      ref = [5, 24, 0, 13, 7];
      QUnit.deepEqual(dummyRanking.points.asArray(), ref,
          'multiple results work');

      /*
       * Note to self: further input/result validation should be performed in
       * individual tests, for every dummyRanking component.
       */

      dummyRanking = new Emitter();
      dummyRanking.length = 5;
      names = ['saldo'];
      listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking,
          names);
      QUnit.deepEqual(names, ['points', 'lostpoints', 'saldo'],
          'hidden dependencies: valid names and name order');
      QUnit.deepEqual(listeners.length, 3,
          'hidden dependencies: additional listeners');
      QUnit.ok(dummyRanking.points, 'listener creates points field');
      QUnit.ok(dummyRanking.lostpoints, 'listener creates lostpoints field');
      QUnit.ok(dummyRanking.saldo, 'listener creates saldo field');

      dummyRanking = new Emitter();
      dummyRanking.length = 5;
      names = ['points', 'lostpoints', 'points'];
      listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking,
          names);
      QUnit.deepEqual(names, ['points', 'lostpoints'],
          'duplicate dependencies: removing duplicates');
      QUnit.deepEqual(listeners.length, 2,
          'hidden dependencies: additional listeners');

      dummyRanking = new Emitter();
      dummyRanking.length = 5;
      names = ['points', 'wtfisthis', 'saldo'];
      listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking,
          names);
      QUnit.equal(listeners, undefined, 'undefined name -> abort');
      QUnit.deepEqual(names, ['wtfisthis'],
          'undefined name -> names array contains undefined entries');
    });
  };
});
