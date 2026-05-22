/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import ResultReferenceModel from '../resultreferencemodel.js';
import MatchResult from '../matchresult.js';
import MatchModel from '../matchmodel.js';
import ListModel from '../../list/listmodel.js';
test('ResultReferenceModel', () => {
  var game, result, ref, teamlist;
  teamlist = new ListModel();
  teamlist.push(5);
  teamlist.push(7);
  teamlist.push(3);
  teamlist.push(9);
  game = new MatchModel([3, 2, 1, 0], 2, 5);
  result = new MatchResult(game, [13, 7, 5, 2]);
  ref = new ResultReferenceModel(result, teamlist);
  expect(ref.getID(), 'identical game ids').toBe(game.getID());
  expect(ref.getGroup(), 'identical game group').toBe(game.getGroup());
  expect(ref.score, 'score is retained').toEqual([13, 7, 5, 2]);
  expect(ref.getTeamID(0), 'global value').toBe(9);
  expect(ref.getTeamID(1), 'global value').toBe(3);
  expect(ref.getTeamID(2), 'global value').toBe(7);
  expect(ref.getTeamID(3), 'global value').toBe(5);
  teamlist.set(1, 12);
  teamlist.remove(0);
  teamlist.push(53);
  teamlist.remove(2);

  // The time of reference is relevant, not the team list at a later
  // time
  expect(ref.getTeamID(0), 'teamlist changes have no impact').toBe(9);
  expect(ref.getTeamID(1), 'teamlist changes have no impact').toBe(3);
  expect(ref.getTeamID(2), 'teamlist changes have no impact').toBe(7);
  expect(ref.getTeamID(3), 'teamlist changes have no impact').toBe(5);
});