/**
 * unit test
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import MatchModel from '../matchmodel.js';
import '../matchresult.js';
import MatchReferenceModel from '../matchreferencemodel.js';
import ListModel from '../../list/listmodel.js';
test('MatchReferenceModel', () => {
  let game, gameref, teamlist, listener;
  teamlist = new ListModel();
  teamlist.push(5);
  teamlist.push(7);
  teamlist.push(3);
  teamlist.push(9);
  game = new MatchModel([3, 2, 1, 0], 2, 5);
  expect(game.getTeamID(0), 'MatchModel: internal value').toBe(3);
  expect(game.getTeamID(1), 'MatchModel: internal value').toBe(2);
  expect(game.getTeamID(2), 'MatchModel: internal value').toBe(1);
  expect(game.getTeamID(3), 'MatchModel: internal value').toBe(0);
  gameref = new MatchReferenceModel(game, teamlist);
  expect(gameref.getID(), 'identical game ids').toBe(game.getID());
  expect(gameref.getGroup(), 'identical game group').toBe(game.getGroup());
  expect(gameref.getTeamID(0), 'global value').toBe(9);
  expect(gameref.getTeamID(1), 'global value').toBe(3);
  expect(gameref.getTeamID(2), 'global value').toBe(7);
  expect(gameref.getTeamID(3), 'global value').toBe(5);
  teamlist.set(1, 12);
  teamlist.remove(0);
  teamlist.push(53);
  teamlist.remove(2);

  // The time of reference is relevant, not the team list at a later
  // time
  expect(gameref.getTeamID(0), 'teamlist changes have no impact').toBe(9);
  expect(gameref.getTeamID(1), 'teamlist changes have no impact').toBe(3);
  expect(gameref.getTeamID(2), 'teamlist changes have no impact').toBe(7);
  expect(gameref.getTeamID(3), 'teamlist changes have no impact').toBe(5);
  listener = {
    finished: false,
    onfinish: function () {
      this.finished = true;
    },
    emitters: []
  };
  game = new MatchModel([1, 2], 0, 2);
  gameref = new MatchReferenceModel(game, teamlist);
  gameref.registerListener(listener);
  game.finish([3, 4]);
  expect(listener.finished, '"finish" event cascades through').toBe(true);
  listener.finished = false;
  game = new MatchModel([1, 2], 0, 2);
  gameref = new MatchReferenceModel(game, teamlist);
  game.registerListener(listener);
  gameref.finish([3, 4]);
  expect(listener.finished, 'finish() is forwarded properly').toBe(true);
  listener.finished = false;
  game = new MatchModel([1, 2], 0, 2);
  gameref = new MatchReferenceModel(game, teamlist);
  gameref.registerListener(listener);
  gameref.finish([3, 4]);
  expect(listener.finished, 'finish() -> onfinish roundtrip').toBe(true);
});