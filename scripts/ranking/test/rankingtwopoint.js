/**
 * Unit Tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import RankingModel from '../rankingmodel.js'
import MatchResult from '../../core/matchresult.js'
import MatchModel from '../../core/matchmodel.js'
import CorrectionModel from '../../core/correctionmodel.js'
test('TwoPoint Ranking', () => {
  let ret, ref
  const ranking = new RankingModel(['twopoint', 'wins', 'points'], 5)
  expect(
    ranking.dataListeners.twopoint.isPrimary(),
    'twopoint is a primary dataListener'
  ).toBe(true)
  ref = {
    components: ['twopoint', 'wins', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [0, 0, 0, 0, 0],
    displayOrder: [0, 1, 2, 3, 4],
    twopoint: [0, 0, 0, 0, 0],
    wins: [0, 0, 0, 0, 0],
    points: [0, 0, 0, 0, 0]
  }
  ret = ranking.get()
  expect(ret, 'empty ranking: correct TwoPoint score').toEqual(ref)
  ranking.result(new MatchResult(new MatchModel([1, 3], 0, 0), [8, 3]))
  ref = {
    components: ['twopoint', 'wins', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [2, 0, 2, 1, 2],
    displayOrder: [1, 3, 0, 2, 4],
    twopoint: [0, 2, 0, 0, 0],
    wins: [0, 1, 0, 0, 0],
    points: [0, 8, 0, 3, 0]
  }
  ret = ranking.get()
  expect(ret, 'win for A yields 3 points').toEqual(ref)
  ranking.result(new MatchResult(new MatchModel([0, 2], 0, 1), [0, 8]))
  ref = {
    components: ['twopoint', 'wins', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [3, 0, 0, 2, 3],
    displayOrder: [1, 2, 3, 0, 4],
    twopoint: [0, 2, 2, 0, 0],
    wins: [0, 1, 1, 0, 0],
    points: [0, 8, 8, 3, 0]
  }
  ret = ranking.get()
  expect(ret, 'win for B yields 3 points').toEqual(ref)
  ranking.result(new MatchResult(new MatchModel([4, 3], 0, 2), [3, 3]))
  ref = {
    components: ['twopoint', 'wins', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [4, 0, 0, 2, 3],
    displayOrder: [1, 2, 3, 4, 0],
    twopoint: [0, 2, 2, 1, 1],
    wins: [0, 1, 1, 0, 0],
    points: [0, 8, 8, 6, 3]
  }
  ret = ranking.get()
  expect(ret, 'draw yields 1 point each').toEqual(ref)
  ranking.correct(new CorrectionModel(new MatchResult(new MatchModel([4, 3], 0, 2), [3, 3]), new MatchResult(new MatchModel([4, 3], 0, 2), [3, 8])))
  ref = {
    components: ['twopoint', 'wins', 'points'],
    ids: [0, 1, 2, 3, 4],
    ranks: [4, 1, 1, 0, 3],
    displayOrder: [3, 1, 2, 4, 0],
    twopoint: [0, 2, 2, 2, 0],
    wins: [0, 1, 1, 1, 0],
    points: [0, 8, 8, 11, 3]
  }
  ret = ranking.get()
  expect(ret, 'corrections work').toEqual(ref)
})
