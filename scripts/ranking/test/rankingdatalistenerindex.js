/**
 * RankingDataListenerIndex class tests
 *
 * @return RankingDataListenerIndex
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import RankingDataListenerIndex from '../rankingdatalistenerindex.js';
import MatchResult from '../../core/matchresult.js';
import MatchModel from '../../core/matchmodel.js';
import Emitter from '../../core/emitter.js';
test('RankingDataListenerIndex', () => {
  let names, listeners, dummyRanking, result, ref;
  dummyRanking = new Emitter();
  dummyRanking.length = 5;
  dummyRanking.EVENTS = {
    'result': true
  };
  names = [];
  listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking, names);
  expect(names, 'empty names: still valid input').toEqual([]);
  expect(listeners, 'empty names: no listeners').toEqual([]);
  names = ['points'];
  listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking, names);
  expect(names, 'flat dependencies: valid names out').toEqual(['points']);
  expect(listeners.length, 'flat dependencies: one listener').toEqual(1);
  expect(dummyRanking.points, 'listener creates points field').toBeTruthy();
  expect(dummyRanking.points.length, 'listener initializes points field size').toBe(dummyRanking.length);
  expect(dummyRanking.points, 'dummyRanking and listener share the reference').toBe(listeners[0].points);
  result = new MatchResult(new MatchModel([1, 4], 0, 0), [13, 7]);
  dummyRanking.emit('result', result);
  ref = [0, 13, 0, 0, 7];
  expect(dummyRanking.points.asArray(), 'single result accepted').toEqual(ref);
  result = new MatchResult(new MatchModel([0, 1], 0, 0), [5, 11]);
  dummyRanking.emit('result', result);
  result = new MatchResult(new MatchModel([3, 2], 0, 0), [13, 0]);
  dummyRanking.emit('result', result);
  ref = [5, 24, 0, 13, 7];
  expect(dummyRanking.points.asArray(), 'multiple results work').toEqual(ref);

  /*
   * Note to self: further input/result validation should be performed in
   * individual tests, for every dummyRanking component.
   */

  dummyRanking = new Emitter();
  dummyRanking.length = 5;
  names = ['saldo'];
  listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking, names);
  expect(names, 'hidden dependencies: valid names and name order').toEqual(['points', 'lostpoints', 'saldo']);
  expect(listeners.length, 'hidden dependencies: additional listeners').toEqual(3);
  expect(dummyRanking.points, 'listener creates points field').toBeTruthy();
  expect(dummyRanking.lostpoints, 'listener creates lostpoints field').toBeTruthy();
  expect(dummyRanking.saldo, 'listener creates saldo field').toBeTruthy();
  dummyRanking = new Emitter();
  dummyRanking.length = 5;
  names = ['points', 'lostpoints', 'points'];
  listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking, names);
  expect(names, 'duplicate dependencies: removing duplicates').toEqual(['points', 'lostpoints']);
  expect(listeners.length, 'hidden dependencies: additional listeners').toEqual(2);
  dummyRanking = new Emitter();
  dummyRanking.length = 5;
  names = ['points', 'wtfisthis', 'saldo'];
  listeners = RankingDataListenerIndex.registerDataListeners(dummyRanking, names);
  expect(listeners, 'undefined name -> abort').toBe(undefined);
  expect(names, 'undefined name -> names array contains undefined entries').toEqual(['wtfisthis']);
});