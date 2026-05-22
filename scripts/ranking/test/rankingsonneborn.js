/**
 * RankingModel class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import RankingModel from '../rankingmodel.js';
import MatchResult from '../../core/matchresult.js';
import MatchModel from '../../core/matchmodel.js';
import CorrectionModel from '../../core/correctionmodel.js';
test('Sonneborn-Berger Ranking', () => {
  let ranking, ref, ret;
  ranking = new RankingModel(['wins', 'sonneborn'], 5);
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4],
    sonneborn: [0, 0, 0, 0, 0],
    wins: [0, 0, 0, 0, 0]
  };
  ret = ranking.get();
  expect(ret, 'empty ranking: correct SB-score').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [13, 7]));
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [1, 0, 1, 1, 1],
    displayOrder: [1, 0, 2, 3, 4],
    sonneborn: [0, 0, 0, 0, 0],
    wins: [0, 1, 0, 0, 0]
  };
  ret = ranking.get();
  expect(ret, 'first ranking is correct').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([0, 4], 0, 0), [0, 11]));
  ret = ranking.get();
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 0, 2, 2, 0],
    displayOrder: [1, 4, 0, 2, 3],
    sonneborn: [0, 0, 0, 0, 0],
    wins: [0, 1, 0, 0, 1]
  };
  expect(ret, 'second ranking is correct').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([1, 4], 0, 0), [13, 12]));
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 0, 2, 2, 1],
    displayOrder: [1, 4, 0, 2, 3],
    sonneborn: [0, 1, 0, 0, 0],
    wins: [0, 2, 0, 0, 1]
  };
  ret = ranking.get();
  expect(ret, 'third ranking is correct').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([1, 2], 0, 0), [5, 13]));
  ranking.result(new MatchResult(new MatchModel([3, 0], 0, 0), [13, 0]));
  ranking.result(new MatchResult(new MatchModel([4, 2], 0, 0), [11, 13]));
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [4, 1, 0, 2, 2],
    displayOrder: [2, 1, 3, 4, 0],
    sonneborn: [0, 2, 3, 0, 0],
    wins: [0, 2, 2, 1, 1]
  };
  ret = ranking.get();
  expect(ret, 'final ranking is correct').toEqual(ref);

  /*
   * correct
   */
  ranking.correct(new CorrectionModel(
  //
  new MatchResult(new MatchModel([3, 0], 0, 0), [13, 0]),
  //
  new MatchResult(new MatchModel([3, 0], 0, 0), [0, 13])) //
  );
  ref = {
    components: ['wins', 'sonneborn'],
    ids: [0, 1, 2, 3, 4],
    ranks: [3, 1, 0, 4, 2],
    displayOrder: [2, 1, 4, 0, 3],
    sonneborn: [0, 1, 3, 0, 1],
    wins: [1, 2, 2, 0, 1]
  };
  ret = ranking.get();
  expect(ret, 'correction is correct').toEqual(ref);
});