/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import Listener from '../../core/listener.js';
import ListModel from '../listmodel.js';
import MapListModel from '../maplistmodel.js';
test('MapListModel', () => {
  var teams, refs, listener, indices;
  teams = new ListModel();
  teams.push(5);
  teams.push(4);
  teams.push(3);
  teams.push(2);
  teams.push(1);
  teams.push(0);
  indices = new ListModel();
  indices.push(1);
  indices.push(3);
  indices.push(5);
  refs = new MapListModel(indices, teams);
  expect(refs.length, 'number of teams match after initialization').toBe(indices.length);
  expect(refs.asArray(), 'ids get translated').toEqual([4, 2, 0]);
  listener = new Listener(refs);
  listener = new Listener(refs);
  listener.success = false;
  listener.callcount = 0;
  listener.oninsert = function () {
    this.success = true;
    this.callcount += 1;
  };
  indices.push(2);
  expect(listener.success, '"insert" event is re-emitted').toBeTruthy();
  expect(listener.callcount, '"insert" is emitted exactly once').toBe(1);
  expect(refs.length, 'new team gets added to the indices list').toBe(4);
  listener.destroy();
  expect(refs.asArray(), 'ids get translated').toEqual([4, 2, 0, 3]);
  listener = new Listener(refs);
  listener.success = false;
  listener.callcount = 0;
  listener.onremove = function () {
    this.success = true;
    this.callcount += 1;
  };
  indices.remove(2);
  expect(indices.length, 'match has been removed from indices').toBe(3);
  expect(refs.length, 'match has been removed from refs').toBe(3);
  expect(listener.success, '"remove" event propagates to the matchref').toBeTruthy();
  expect(listener.callcount, '"remove" is emitted exactly once').toBe(1);
  expect(refs.asArray(), 'ids get translated').toEqual([4, 2, 3]);
});