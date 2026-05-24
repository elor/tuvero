/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import KOTournamentModel from '../kotournamentmodel.js';
import TournamentModel from '../tournamentmodel.js';
test('KOTournamentModel', () => {
  let ids, result, ref, tournament;
  expect(
    KOTournamentModel.prototype instanceof TournamentModel,
    'KOTournamentModel is subclass of TournamentModel'
  ).toBeTruthy();
  ids = [];
  while (ids.length <= 33) {
    ids.push(ids.length);
  }

  /*
   * Tree traversal functions
   */
  result = ids.map(function (id) {
    return KOTournamentModel.ceilPowerOfTwo(id);
  });
  ref = [1, 1, 2, 4, 4, 8, 8, 8, 8, 16, 16, 16, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 64];
  expect(result, 'ceilPowerOfTwo()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.nextRoundMatchID(id);
  });
  ref = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16];
  expect(result, 'nextRoundMatchID()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.isSecondInNextRound(id);
  });
  ref = [false, false, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true];
  expect(result, 'isSecondInNextRound()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.complementaryMatchID(id);
  });
  ref = [1, 0, 3, 2, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17, 16, 19, 18, 21, 20, 23, 22, 25, 24, 27, 26, 29, 28, 31, 30, 33, 32];
  expect(result, 'complementaryMatchID()').toEqual(ref);
  result = ids.slice(0, 16).map(function (id) {
    return KOTournamentModel.firstMatchIDOfRound(id);
  });
  ref = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
  expect(result, 'firstMatchIDOfRound()').toEqual(ref);
  result = ids.slice(0, 16).map(function (id) {
    return KOTournamentModel.numMatchesInRound(id);
  });
  ref = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
  expect(result, 'numMatchesInRound()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.roundOfMatchID(id);
  });
  ref = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5];
  expect(result, 'roundOfMatchID()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.loserGroupID(0, id);
  });
  ref = [0, 0, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16];
  expect(result, 'loserGroupID(0)').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.loserGroupID(8, id);
  });
  ref = ref.map(function (a) {
    return a + 8;
  });
  expect(result, 'loserGroupID(8)').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.initialRoundForTeams(id);
  });
  ref = [-1, -1, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5];
  expect(result, 'loserGroupID()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.roundsInGroup(id);
  });
  ref = [30, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 5, 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 6, 1];
  expect(result, 'roundsInGroup()').toEqual(ref);
  result = ids.map(function (id) {
    return KOTournamentModel.parentGroup(id);
  });
  ref = [0, 0, 0, 2, 0, 4, 4, 6, 0, 8, 8, 10, 8, 12, 12, 14, 0, 16, 16, 18, 16, 20, 20, 22, 16, 24, 24, 26, 24, 28, 28, 30, 0, 32];
  expect(result, 'parentGroup()').toEqual(ref);

  /*
   * initial matches
   */
  tournament = new KOTournamentModel();
  tournament.addTeam(0);
  tournament.addTeam(1);
  tournament.addTeam(2);
  expect(tournament.run(), 'run() with 3 teams succeeds').toBeTruthy();
  expect(tournament.getProperty('komode'), 'initial ko mode is "matched"').toBe('matched');
});