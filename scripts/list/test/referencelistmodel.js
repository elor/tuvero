/**
 * Unit tests for ListModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Listener from '../../core/listener.js';
import ListModel from '../listmodel.js';
import MatchModel from '../../core/matchmodel.js';
import '../../core/matchresult.js';
import MatchReferenceModel from '../../core/matchreferencemodel.js';
import ReferenceListModel from '../referencelistmodel.js';
test('ReferenceListModel', () => {
  let teams, matches, refs, listener, matchref;
  teams = new ListModel();
  teams.push(5);
  teams.push(4);
  teams.push(3);
  teams.push(2);
  teams.push(1);
  teams.push(0);
  matches = new ListModel();
  matches.push(new MatchModel([1, 2], 0, 0));
  matches.push(new MatchModel([0, 5], 1, 0));
  refs = new ReferenceListModel(matches, teams, MatchReferenceModel);
  expect(refs.length, 'number of teams match after initialization').toBe(matches.length);
  listener = new Listener(refs);
  listener.success = false;
  listener.callcount = 0;
  listener.oninsert = function () {
    this.success = true;
    this.callcount += 1;
  };
  matches.push(new MatchModel([4, 3], 2, 0));
  expect(listener.success, '"insert" event is re-emitted').toBeTruthy();
  expect(listener.callcount, '"insert" is emitted exactly once').toBe(1);
  expect(refs.length, 'new team gets added to the matches list').toBe(3);
  listener.destroy();
  matchref = refs.get(0);
  expect(matchref.getTeamID(0), 'team id gets translated').toBe(4);
  expect(matchref.getTeamID(1), 'team id gets translated').toBe(3);
  matchref = refs.get(1);
  expect(matchref.getTeamID(0), 'team id gets translated').toBe(5);
  expect(matchref.getTeamID(1), 'team id gets translated').toBe(0);
  matchref = refs.get(2);
  expect(matchref.getTeamID(0), 'team id gets translated').toBe(1);
  expect(matchref.getTeamID(1), 'team id gets translated').toBe(2);
  listener = new Listener(matchref);
  listener.numEvents = 0;
  listener.onfinish = function () {
    this.numEvents += 1;
  };
  matches.get(2).registerListener(listener);
  matches.get(2).finish([13, 7]);
  expect(listener.numEvents, 'both "finish" events propagate to the matchref').toBe(2);
  expect(matches.length, 'match has not been removed by finish()').toBe(3);
  listener.destroy();
  listener = new Listener(refs);
  listener.success = false;
  listener.callcount = 0;
  listener.onremove = function () {
    this.success = true;
    this.callcount += 1;
  };
  matches.remove(2);
  expect(matches.length, 'match has been removed from matches').toBe(2);
  expect(refs.length, 'match has been removed from refs').toBe(2);
  expect(listener.success, '"remove" event propagates to the matchref').toBeTruthy();
  expect(listener.callcount, '"remove" is emitted exactly once').toBe(1);
});