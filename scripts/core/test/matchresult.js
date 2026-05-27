/**
 * MatchResult tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import MatchModel from '../matchmodel.js'
import MatchResult from '../matchresult.js'
test('MatchResult', () => {
  let match, result, score, success, teams, data
  match = new MatchModel([1, 2], 2, 5)
  result = undefined
  try {
    result = new MatchResult()
    success = true
  } catch (e) {
    success = false
  }
  expect(success, 'empty construction works').toBeTruthy()
  expect(result.match, 'empty construction -> no match').toBe(undefined)
  expect(result.teams, 'empty construction -> empty teams').toEqual([])
  expect(result.score, 'empty construction -> empty score').toEqual([])
  expect(result.getID(), 'empty construction -> id == -1').toEqual(-1)
  expect(result.getGroup(), 'empty construction -> group == -1').toEqual(-1)
  score = [13, 7]
  try {
    result = new MatchResult(match, score)
    success = true
  } catch (e) {
    success = false
  }
  expect(success, 'passing match as first argument').toBeTruthy()
  expect(result.match, 'result.match got kicked out of the API').toBe(undefined)
  expect(result.teams, 'match teams match').toEqual(match.teams)
  expect(result.teams !== match.teams, 'match teams are only copies').toBeTruthy()
  expect(result.score, 'scores match').toEqual(score)
  expect(result.score !== score, 'scores are only copies of another').toBeTruthy()
  expect(result.getID(), 'keeping the id').toEqual(2)
  expect(result.getGroup(), 'keeping the group id').toEqual(5)
  expect(result.isBye(), 'result is not a bye').toBe(false)

  /*
   * create MatchResult from another MatchResult
   */

  score = [8, 12]
  result = new MatchResult(result, score)
  expect(success, 'passing match as first argument').toBeTruthy()
  expect(result.match, 'result.match got kicked out of the API').toBe(undefined)
  expect(result.teams, 'match teams match').toEqual(match.teams)
  expect(result.teams !== match.teams, 'match teams are only copies').toBeTruthy()
  expect(result.score, 'scores match').toEqual(score)
  expect(result.score !== score, 'scores are only copies of another').toBeTruthy()
  expect(result.getID(), 'keeping the id').toEqual(2)
  expect(result.getGroup(), 'keeping the group id').toEqual(5)
  expect(result.isBye(), 'result is not a bye').toBe(false)

  /*
   * incompatible API changes
   */

  teams = [5, 1]
  score = [5, 11]
  try {
    result = new MatchResult(teams, score)
    success = false
  } catch (e) {
    success = true
  }
  expect(
    success,
    'construction with a team array does not work anymore (API change)'
  ).toBeTruthy()

  /*
   * save/restore
   */

  result = new MatchResult(new MatchModel([5, 3], 8, 1), [13, 7])
  data = result.save()
  expect(data, 'save() finishes').toBeTruthy()
  teams = [5, 3]
  score = [13, 7]
  result = new MatchResult()
  expect(result.restore(data), 'restore() finishes').toBeTruthy()
  expect(result.match, 'restore(): match not restored').toBe(undefined)
  expect(result.teams, 'restore(): teams restored').toEqual(teams)
  expect(result.score, 'restore(): scores restored').toEqual(score)
  expect(result.getID(), 'restore(): id restored').toEqual(8)
  expect(result.getGroup(), 'restore(): group id restored').toEqual(1)
  expect(result.isBye(), 'result is not a bye').toBe(false)

  /*
   * isRunningMatch()
   */
  expect(result.isRunningMatch(), 'results are not running matches').toBe(false)
})
