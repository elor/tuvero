/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import extend from '../../lib/extend.js';
import ByeResult from '../byeresult.js';
import MatchResult from '../matchresult.js';
test('ByeResult', () => {
  var bye, data;
  expect(
   extend.isSubclass(ByeResult, MatchResult),
   'ByeResult is subclass of MatchResult'
  ).toBeTruthy();

  /*
   * construction
   */
  bye = new ByeResult(5, [13, 7], 3, 9);
  expect(bye.getID(), 'id matches the argument').toBe(3);
  expect(bye.getGroup(), 'group matches the argument').toBe(9);
  expect(bye.length, 'bye has two teams').toBe(2);
  expect(bye.getTeamID(0), 'first team matches the argument').toBe(5);
  expect(bye.getTeamID(1), 'second team matches the argument').toBe(5);
  expect(bye.score, 'score matches the argument').toEqual([13, 7]);
  expect(bye.isBye(), 'bye.isBye() is true').toBe(true);

  /*
   * save/restore
   */
  data = bye.save();
  expect(data, 'save() returns').toBeTruthy();

  // Not a typo. Bye is supposed to be converted into a matchresult.
  bye = new MatchResult();
  expect(bye.restore(data), 'restore() returns').toBeTruthy();
  expect(bye.getID(), 'id matches the argument').toBe(3);
  expect(bye.getGroup(), 'group matches the argument').toBe(9);
  expect(bye.length, 'bye has two teams').toBe(2);
  expect(bye.getTeamID(0), 'first team matches the argument').toBe(5);
  expect(bye.getTeamID(1), 'second team matches the argument').toBe(5);
  expect(bye.score, 'score matches the argument').toEqual([13, 7]);
  expect(bye.isBye(), 'bye.isBye() is true').toBe(true);

  /*
   * isRunningMatch()
   */
  expect(bye.isRunningMatch(), 'byes are not running matches').toBe(false);
});