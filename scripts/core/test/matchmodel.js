/**
 * unit test
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import MatchModel from '../matchmodel.js'
import MatchResult from '../matchresult.js'
import Listener from '../listener.js'
test('MatchModel', () => {
  let game, array, ref, listener, data
  game = new MatchModel()
  expect(game, 'empty initialization works').toBeTruthy()
  game = new MatchModel([15])
  expect(game, 'empty game id still instantiates the MatchModel.').toBeTruthy()
  expect(game.getID(), 'game id default to -1').toBe(-1)
  game = new MatchModel([15], 0)
  expect(game, 'empty group still instantiates the MatchModel').toBeTruthy()
  expect(game.getGroup(), 'group defaults to -1').toBe(-1)
  game = new MatchModel([], 0, 0)
  expect(game, 'empty teams array still works').toBeTruthy()
  game = new MatchModel([15], 51, 5)
  expect(game.getID(), 'id is correct').toBe(51)
  expect(game.getGroup(), 'group is correct').toBe(5)
  expect(game.length, 'game.length is correct').toBe(1)
  expect(game.getTeamID(-123), 'getTeamID below 0').toBe(undefined)
  expect(game.getTeamID(1), 'getTeamID at game.length').toBe(undefined)
  expect(game.getTeamID(12), 'getTeamID outside of range').toBe(undefined)
  expect(game.getTeamID(0), 'getTeamID inside range').toBe(15)
  array = [1, 2, 3, 4, 5]
  game = new MatchModel(array, 2, 3)
  array[3] = 321
  expect(game.getTeamID(3), 'MatchModel() copies the team array').toBe(4)
  game = new MatchModel([1, 2], 0, 0)
  ref = new MatchResult(game, [13, 7])
  listener = new Listener()
  listener.finished = false
  listener.onfinish = function () {
    this.finished = true
  }
  game.registerListener(listener)
  expect(game.finish(), 'game.finish() fails').toBe(undefined)
  expect(game.finish([]), 'game.finish([]) fails').toBe(undefined)
  expect(game.finish([3, 2, 1]), 'game.finish([3,2,1]) fails').toBe(undefined)
  expect(listener.finished, 'no "finish" event sent yet').toBe(false)
  expect(game.finish([13, 7]), 'game.finish([13,7]) works').toEqual(ref)
  expect(listener.finished, '"finish" event sent yet').toBe(true)
  game = new MatchModel([4, 1, 2], 2, 3)
  data = game.save()
  expect(data, 'save() returns something').toBeTruthy()
  game = new MatchModel()
  expect(game.restore(data), 'restore() works').toBe(true)
  expect(game.length, 'restore(): correct length').toBe(3)
  expect(game.getID(), 'restore(): correct id').toBe(2)
  expect(game.getGroup(), 'restore(): correct group').toBe(3)
  expect(game.getTeamID(0), 'restore(): correct team id 0').toBe(4)
  expect(game.getTeamID(1), 'restore(): correct team id 1').toBe(1)
  expect(game.getTeamID(2), 'restore(): correct team id 2').toBe(2)

  /*
   * isRunningMatch()
   */
  game = new MatchModel([0, 1], 0, 0)
  expect(game.isRunningMatch(), 'isRunningMatch() of a typical match').toBeTruthy()
  game = new MatchModel([0, 0], 0, 0)
  expect(game.isRunningMatch(), 'isRunningMatch() of a match with duplicate teams').toBe(false)
  game = new MatchModel([0, undefined], 0, 0)
  expect(
    game.isRunningMatch(),
    'isRunningMatch() of a match with an undefined team'
  ).toBe(false)

  /*
   * save() with an undefined team
   */
  data = game.save()
  expect(data, 'save() with undefined team succeeds').toBeTruthy()
  game = new MatchModel()
  expect(game.restore(data), 'restore() with undefined team works').toBe(true)
  expect(game.getTeamID(1), 'second team still is undefined').toBe(undefined)
})
