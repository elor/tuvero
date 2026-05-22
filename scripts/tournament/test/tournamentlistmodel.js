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
import TournamentListModel from '../tournamentlistmodel.js';
import TournamentIndex from '../tournamentindex.js';
import IndexedListModel from '../../list/indexedlistmodel.js';
test('TournamentListModel', () => {
  var tournament, list, ref, savedata, ranking;
  expect(
    extend.isSubclass(TournamentListModel, IndexedListModel),
    'TournamentListModel is subclass of IndexedListModel'
  ).toBeTruthy();
  list = new TournamentListModel();
  expect(list, 'TournamentListModel construction works').toBeTruthy();
  expect(list.length, 'no initial entries').toBe(0);
  expect(list.tournamentIDsForEachTeam(), 'no tournament ids yet').toEqual([]);
  tournament = TournamentIndex.createTournament('round', ['sonneborn', 'id']);
  tournament.addTeam(0);
  tournament.addTeam(1);
  tournament.addTeam(2);
  tournament.addTeam(4);
  list.push(tournament);
  ref = [0, 0, 0, undefined, 0];
  expect(
    list.tournamentIDsForEachTeam(),
    'tournament ids for single tournament are correct'
  ).toEqual(ref);
  tournament = TournamentIndex.createTournament('round', ['sonneborn', 'id']);
  tournament.addTeam(1);
  tournament.addTeam(3);
  tournament.addTeam(5);
  list.push(tournament);
  ref = [0, 1, 0, 1, 0, 1];
  expect(
    list.tournamentIDsForEachTeam(),
    'tournament ids for two tournaments are correct'
  ).toEqual(ref);

  // HACK! DO NOT ACCESS DIRECTLY!
  list.get(0).state.forceState('finished');
  ref = [undefined, 1, undefined, 1, undefined, 1];
  expect(
    list.tournamentIDsForEachTeam(),
    'ids of finished tournaments are ignored (undefined)'
  ).toEqual(ref);
  savedata = list.save();
  expect(savedata, 'save() returns properly').toBeTruthy();
  list = new TournamentListModel();
  expect(list.restore(savedata), 'restore() returns true').toBeTruthy();
  expect(
    list.tournamentIDsForEachTeam(),
    'restore() restores the ids for all players'
  ).toEqual(ref);

  // TODO test getGlobalRanking()
  // TODO test closeTournament()
  // TODO test push, insert, pop, remove and erase

  // interlacing
  list = new TournamentListModel();
  tournament = TournamentIndex.createTournament('round', ['id']);
  tournament.setProperty();
  tournament.addTeam(0);
  tournament.addTeam(1);
  tournament.addTeam(2);
  list.push(tournament, 0);

  // must start matches, else tournament gets purged on close due to initial state at end of tournamentlist
  tournament.run();
  tournament.getMatches().map(function (match) {
    match.finish([13, 0]);
  });
  tournament = TournamentIndex.createTournament('round', ['id']);
  tournament.addTeam(3);
  tournament.addTeam(4);
  tournament.addTeam(5);
  list.push(tournament, 3);

  // must start matches, else tournament gets purged on close due to initial state at end of tournamentlist
  tournament.run();
  tournament.getMatches().map(function (match) {
    match.finish([13, 0]);
  });
  list.closeTournament(0);
  list.closeTournament(1);
  list.interlaceCount.set(2);
  ref = undefined;
  ranking = list.getGlobalRanking(6);
  expect(ranking.displayOrder, 'displayOrder').toEqual([0, 3, 1, 4, 2, 5]);
});