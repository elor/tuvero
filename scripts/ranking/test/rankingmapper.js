/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import ListModel from '../../list/listmodel.js';
import RankingModel from '../rankingmodel.js';
import RankingMapper from '../rankingmapper.js';
import MatchResult from '../../core/matchresult.js';
import MatchModel from '../../core/matchmodel.js';
import Model from '../../core/model.js';
import Listener from '../../core/listener.js';
test('RankingMapper', () => {
  let internal, ranking, listener, teams, ref;
  expect(
    RankingMapper.prototype instanceof Model,
    'RankingMapper is subclass of Model'
  ).toBeTruthy();
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
  expect(
    ranking.get(),
    'only the ids get re-mapped to external ids, not the displayOrder'
  ).toEqual(ref);
  internal.result(new MatchResult(new MatchModel([1, 2], 0, 0), [13, 7]));
  ref = {
    components: ['wins', 'saldo'],
    ids: [5, 4, 3, 2, 1],
    ranks: [1, 0, 4, 1, 1],
    displayOrder: [1, 0, 3, 4, 2],
    wins: [0, 1, 0, 0, 0],
    saldo: [0, 6, -6, 0, 0]
  };
  expect(ranking.get(), 'ids remapped after first result').toEqual(ref);
  listener = new Listener(ranking);
  listener.onupdate = function (emitter) {
    let reference;
    this.success = true;
    reference = {
      components: ['wins', 'saldo'],
      ids: [5, 4, 3, 2, 1],
      ranks: [2, 0, 0, 2, 4],
      displayOrder: [1, 2, 0, 3, 4],
      wins: [0, 1, 1, 0, 0],
      saldo: [0, 6, 6, 0, -12]
    };
    expect(emitter, 'callback: emitter is ranking (safety check)').toBe(ranking);
    expect(emitter.get(), 'ids remapped after second result, inside callback').toEqual(reference);
  };
  internal.result(new MatchResult(new MatchModel([2, 4], 0, 0), [13, 1]));
  expect(listener.success, 'RankingMapper emits update events').toBeTruthy();
  ref = {
    components: ['wins', 'saldo'],
    ids: [5, 4, 3, 2, 1],
    ranks: [2, 0, 0, 2, 4],
    displayOrder: [1, 2, 0, 3, 4],
    wins: [0, 1, 1, 0, 0],
    saldo: [0, 6, 6, 0, -12]
  };
  expect(ranking.get(), 'ids remapped after second result, outside of callback').toEqual(ref);
});