/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import TournamentModel from '../tournamentmodel.js';
import PropertyModel from '../../core/propertymodel.js';
test('TournamentModel', () => {
  let tournament,
      state,
      teams,
      matches,
      byes,
      match,
      ranking,
      ref,
      data,
      //
      history,
      combinedHistory,
      corrections,
      result;
  expect(
    TournamentModel.prototype instanceof PropertyModel,
    'TournamentModel is subclass of PropertyModel'
  ).toBeTruthy();
  tournament = new TournamentModel(['wins', 'saldo']);
  expect(tournament, 'construction works').toBeTruthy();
  state = tournament.getState();
  teams = tournament.getTeams();
  matches = tournament.getMatches();
  history = tournament.getHistory();
  combinedHistory = tournament.getCombinedHistory();
  corrections = tournament.getCorrections();
  byes = tournament.getVotes('bye');
  ranking = tournament.getRanking();
  expect(state, 'getState() returns').toBeTruthy();
  expect(teams, 'getTeams() returns').toBeTruthy();
  expect(matches, 'getMatches() returns').toBeTruthy();
  expect(history, 'getHistory() returns').toBeTruthy();
  expect(combinedHistory, 'getHistory() returns').toBeTruthy();
  expect(corrections, 'getCorrections() returns').toBeTruthy();
  expect(byes, 'getTeams() returns').toBeTruthy();
  expect(ranking, 'getRanking() returns').toBeTruthy();
  expect(state.get(), 'tournament is constructed in initial state').toBe('initial');
  expect(teams.length, 'no teams registered initially').toBe(0);
  expect(matches.length, 'no matches in initial state').toBe(0);
  expect(byes.length, 'no byes in initial state').toBe(0);
  expect(
    tournament.getVotes('unknownVoteType'),
    'undefined vote type returns undefined'
  ).toBe(undefined);

  /*************************************************************************
   * run
   ************************************************************************/

  expect(tournament.run(), 'run() aborts with insufficient teams').toBe(undefined);
  expect(tournament.addTeam(5), 'addTeam works').toBe(true);
  expect(tournament.addTeam(4), 'addTeam works').toBe(true);
  expect(tournament.addTeam(3), 'addTeam works').toBe(true);
  expect(tournament.addTeam(2), 'addTeam works').toBe(true);
  expect(tournament.addTeam(1), 'addTeam works').toBe(true);
  expect(teams.length, 'teams: length gets updated').toBe(5);
  expect(tournament.teams.length, 'teams: length gets updated').toBe(5);
  expect(tournament.getID(), 'initial id is -1').toBe(-1);
  tournament.setID(5);
  expect(tournament.getID(), 'id can be changed with setID()').toBe(5);

  /*************************************************************************
   * first round
   ************************************************************************/

  expect(tournament.run(), 'run() works with sufficient teams').toBe(true);
  expect(state.get(), 'state is set to "running"').toBe('running');
  expect(matches.length, 'matches have been generated').toBe(1);
  expect(byes.length, 'byes have been generated').toBe(1);
  match = matches.get(0);
  expect(match.getTeamID(0), 'global team id in match').toBe(5);
  expect(match.getTeamID(1), 'global team id in match').toBe(4);
  expect(byes.get(0), 'global team id in bye').toBe(3);
  expect(match.finish([12345, -53]), 'match.finish() with invalid score points').toBeTruthy();
  expect(matches.length, 'match has not been finished').toBe(1);
  expect(history.length, 'match has not been pushed to history').toBe(0);
  expect(combinedHistory.length, 'combinedHistory contains an element').toBe(1);
  expect(
    tournament.finish(),
    'tournament cannot be finished when there are open matches'
  ).toBe(false);
  expect(match.finish([13, 7]), 'match.finish() with proper scores').toBeTruthy();
  expect(matches.length, 'match has been finished').toBe(0);
  expect(history.length, 'match has been pushed to history').toBe(1);
  result = history.get(0);
  expect(result.length, 'history: length of match matches').toBe(2);
  expect(result.getTeamID(0), 'history: global team id in match').toBe(5);
  expect(result.getTeamID(1), 'history: global team id in match').toBe(4);
  expect(state.get(), 'auto-transition to idle state after last match').toBe('idle');
  expect(byes.length, 'votes are cleared before transition to idle state').toBe(0);
  ref = {
    components: ['wins', 'saldo'],
    ids: [5, 4, 3, 2, 1],
    ranks: [0, 4, 1, 1, 1],
    displayOrder: [0, 2, 3, 4, 1],
    wins: [1, 0, 0, 0, 0],
    saldo: [6, -6, 0, 0, 0]
  };
  expect(ranking.get(), 'ranking validation').toEqual(ref);

  /*************************************************************************
   * second round
   ************************************************************************/

  expect(tournament.run(), 'run() works with sufficient teams').toBe(true);
  expect(state.get(), 'state is set to "running"').toBe('running');
  expect(matches.length, 'matches have been generated').toBe(1);
  expect(byes.length, 'byes have been generated').toBe(1);
  expect(history.length, 'history contains a match and a bye').toBe(1);
  expect(
    combinedHistory.length,
    'combined history contains a current match, ' + 'a finished match and the current bye'
  ).toBe(2);
  match = matches.get(0);
  expect(match.getTeamID(0), 'global team id in match').toBe(4);
  expect(match.getTeamID(1), 'global team id in match').toBe(3);
  expect(byes.get(0), 'global team id in bye').toBe(5);
  expect(matches.length, 'match has not been finished').toBe(1);
  expect(match.finish([13, 7]), 'match.finish() with proper scores').toBeTruthy();
  expect(matches.length, 'match has been finished').toBe(0);
  expect(state.get(), 'auto-transition to idle state after last match').toBe('idle');
  expect(byes.length, 'votes are cleared before transition to idle state').toBe(0);
  ref = {
    components: ['wins', 'saldo'],
    ids: [5, 4, 3, 2, 1],
    ranks: [0, 1, 4, 2, 2],
    displayOrder: [0, 1, 3, 4, 2],
    wins: [1, 1, 0, 0, 0],
    saldo: [6, 0, -6, 0, 0]
  };
  expect(ranking.get(), 'ranking validation').toEqual(ref);
  expect(tournament.finish(), 'tournament is finished').toBe(true);
  expect(tournament.run(), 'tournament cannot be un-finished').toBe(undefined);
  expect(ranking.get(), 'ranking validation').toEqual(ref);
  tournament = new TournamentModel(['wins', 'saldo']);
  tournament.addTeam(5);
  tournament.addTeam(3);
  tournament.addTeam(4);
  tournament.addTeam(2);
  tournament.addTeam(1);
  tournament.run();
  tournament.getMatches().get(0).finish([8, 13]);
  tournament.run();
  tournament.setID(3);
  data = tournament.save();
  expect(data, 'save() finishes').toBeTruthy();
  ref = tournament;
  tournament = new TournamentModel();
  expect(tournament.restore(data), 'restore() finishes').toBeTruthy();
  state = tournament.getState();
  teams = tournament.getTeams();
  matches = tournament.getMatches();
  history = tournament.getHistory();
  corrections = tournament.getCorrections();
  byes = tournament.getVotes('bye');
  ranking = tournament.getRanking();
  expect(tournament.getID(), 'restore() restored the id').toBe(3);
  expect(teams.asArray(), 'restore() restored the teams').toEqual(ref.getTeams().asArray());
  expect(state.get(), 'restore() restored the "running" state').toBe('running');
  expect(matches.length, 'restore() restored matches.length').toBe(1);
  match = matches.get(0);
  expect(match.getTeamID(0), 'restore(): team id in match').toBe(3);
  expect(match.getTeamID(1), 'restore(): team id in match').toBe(4);
  expect(byes.asArray(), 'restore() restored the byes').toEqual([5]);
  expect(ranking.get(), 'restore() restored the whole ranking').toEqual(ref.getRanking().get());
  result = history.get(0);
  expect(history.length, 'restore(): history size').toBe(1);
  expect(result.length, 'restore(): restored number of teams in history result').toBe(2);
  expect(result.getTeamID(0), 'restore() history team id 1').toBe(5);
  expect(result.getTeamID(1), 'restore() history team id 2').toBe(3);

  // FIXME test corrections
  // FIXME test history (default, after some tournaments, after
  // restore)
});