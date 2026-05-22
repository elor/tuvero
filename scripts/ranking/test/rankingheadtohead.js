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
test('Head-to-Head Ranking', () => {
  var ranking, ret, ref;
  ranking = new RankingModel(['wins', 'headtohead'], 5);
  ref = {
    components: ['wins', 'headtohead'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4],
    wins: [0, 0, 0, 0, 0],
    headtohead: ['', '', '', '', '']
  };
  ret = ranking.get();
  expect(ret, 'empty ranking: correct H2H-score').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [7, 13]));
  ranking.result(new MatchResult(new MatchModel([1, 0], 0, 0), [13, 9]));
  ref = {
    components: ['wins', 'headtohead'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 1, 2, 0, 2],
    displayOrder: [3, 1, 0, 2, 4],
    wins: [0, 1, 0, 1, 0],
    headtohead: ['', '', '', 1, '']
  };
  ret = ranking.get();
  expect(ret, 'first ranking is correct').toEqual(ref);
  ranking.result(new MatchResult(new MatchModel([0, 3], 0, 0), [13, 11]));
  ref = {
    components: ['wins', 'headtohead'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 3, 0, 3],
    displayOrder: [0, 1, 3, 2, 4],
    wins: [1, 1, 0, 1, 0],
    headtohead: [1, 1, '', 1, '']
  };
  ret = ranking.get();
  expect(ret, 'cyclic ranking finishes').toEqual(ref);

  /*
   * Test for 'ignoring subsequent components' bug, #204
   */

  ranking = new RankingModel(['wins', 'headtohead', 'points'], 6);
  ref = {
    components: ['wins', 'headtohead', 'points'],
    ids: [0, 1, 2, 3, 4, 5],
    ranks: [0, 0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4, 5],
    wins: [0, 0, 0, 0, 0, 0],
    headtohead: ['', '', '', '', '', ''],
    points: [0, 0, 0, 0, 0, 0]
  };
  ret = ranking.get();
  expect(ret, '').toEqual(ref);
});