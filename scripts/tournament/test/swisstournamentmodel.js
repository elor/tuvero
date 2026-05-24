/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import SwissTournamentModel from '../swisstournamentmodel.js';
import TournamentModel from '../tournamentmodel.js';
test('SwissTournamentModel', () => {
  let groups, matches, votes, result, tournament;
  expect(
   SwissTournamentModel.prototype instanceof TournamentModel,
   'SwissTournamentModel is subclass of TournamentModel'
  ).toBeTruthy();
  groups = [];
  votes = {};
  matches = [];
  tournament = new SwissTournamentModel();
  result = tournament.findSwissByesAndMatches(matches, votes, groups);
  expect(result, 'findSwissByesAndMatches: empty groups array').toBeTruthy();
  tournament.addTeam(0);
  groups = [[0]];
  result = tournament.findSwissByesAndMatches(matches, votes, groups);
  expect(result, 'findSwissByesAndMatches: single team').toBeTruthy();
  expect(votes.byes, 'single team: correct bye').toEqual([0]);
  tournament.addTeam(1);
  tournament.addTeam(2);
  tournament.addTeam(3);
  tournament.addTeam(4);
  groups = [[1, 2, 3, 4]];
  votes = {};
  result = tournament.findSwissByesAndMatches(matches, votes, groups);
  expect(result, 'findSwissByesAndMatches: four teams').toBeTruthy();
  expect(matches, 'four teams: matches').toEqual([[1, 2], [3, 4]]);
  groups = [[0, 1, 2, 3]];
  votes = {};
  matches = [];
  tournament.ranking.resize(tournament.length);
  tournament.ranking.winsmatrix.set(2, 3, 1);
  result = tournament.findSwissByesAndMatches(matches, votes, groups);
  expect(result, 'findSwissByesAndMatches: already played').toBeTruthy();
  expect(matches, 'already played: matches').toEqual([[0, 2], [1, 3]]);

  /*
   * tournament playthroughs/starts
   */

  tournament = new SwissTournamentModel(['wins']);
  tournament.addTeam(5);
  tournament.addTeam(4);
  tournament.addTeam(3);
  tournament.addTeam(2);
  tournament.addTeam(1);
  tournament.setProperty('swissmode', SwissTournamentModel.MODES.individual);
  expect(tournament.run(), 'default test tournament').toBeTruthy();
  expect(tournament.getVotes('bye').asArray(), 'bye votes').toEqual([1]);
});