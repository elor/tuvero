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
import RoundTournamentModel from '../roundtournamentmodel.js';
import TournamentModel from '../tournamentmodel.js';
test('RoundTournamentModel', () => {
  let tournament, ret, ref, data, numteams, matches, teams, byes, state;
  expect(
    extend.isSubclass(RoundTournamentModel, TournamentModel),
    'RoundTournamentModel is subclass of TournamentModel'
  ).toBeTruthy();
  tournament = new RoundTournamentModel(['wins', 'sonneborn', 'saldo']);
  expect(tournament, 'proper construction works').toBeTruthy();
  matches = tournament.getMatches();
  byes = tournament.getVotes('bye');
  state = tournament.getState();
  tournament.addTeam(1);
  expect(!tournament.run(), 'too few teams prohibit running the tournament').toBeTruthy();
  tournament.addTeam(2);
  tournament.addTeam(3);
  tournament.addTeam(4);
  tournament.addTeam(5);
  expect(tournament.run(), 'five teams work').toBeTruthy();
  expect(matches.length, 'two games for 5 teams').toBe(2);
  expect(matches.get(0).getID() < matches.get(1).getID(), 'match ids are sorted').toBeTruthy();
  ret = matches.map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    t: [1, 4],
    i: 0,
    g: 0
  }, {
    t: [2, 3],
    i: 1,
    g: 0
  }];
  expect(ret, 'first round: correct teams in the matches').toEqual(ref);
  expect(byes.get(0), 'first round: correct bye').toEqual(5);
  matches.get(0).finish([13, 7]);
  matches.get(0).finish([11, 13]);
  expect(state.get(), 'idle after games finished').toBe('idle');
  expect(matches.length, 'second round does not start automatically').toBe(0);
  expect(tournament.run(), 'second round starts manually').toBeTruthy();
  expect(matches.length, 'second round started').toBe(2);
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    t: [5, 3],
    i: 0,
    g: 1
  }, {
    t: [1, 2],
    i: 1,
    g: 1
  }];
  expect(ret, 'second round: correct teams in the matches').toEqual(ref);
  expect(tournament.getVotes('bye').get(0), 'second round: correct bye').toEqual(4);
  matches.get(0).finish([13, 4]);
  matches.get(0).finish([13, 8]);
  expect(state.get(), 'idle after games finished').toBe('idle');
  expect(matches.length, 'third round does not run automatically').toBe(0);
  expect(tournament.run(), 'third round started manually').toBeTruthy();
  expect(matches.length, 'third round started').toBe(2);
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    t: [4, 2],
    i: 0,
    g: 2
  }, {
    t: [5, 1],
    i: 1,
    g: 2
  }];
  expect(ret, 'third round: correct teams in the matches').toEqual(ref);
  expect(tournament.getVotes('bye').get(0), 'third round: correct bye').toEqual(3);
  matches.get(0).finish([11, 13]);
  matches.get(0).finish([10, 13]);
  expect(state.get(), 'idle after games finished').toBe('idle');
  expect(matches.length, 'fourth round does not start automatically').toBe(0);
  expect(tournament.run(), 'fourth round started manually').toBeTruthy();
  expect(matches.length, 'fourth round started').toBe(2);
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    t: [3, 1],
    i: 0,
    g: 3
  }, {
    t: [4, 5],
    i: 1,
    g: 3
  }];
  expect(ret, 'fourth round: correct teams in the matches').toEqual(ref);
  expect(tournament.getVotes('bye').get(0), 'fourth round: correct bye').toEqual(2);
  matches.get(0).finish([2, 13]);
  matches.get(0).finish([13, 0]);
  expect(state.get(), 'idle after games finished').toBe('idle');
  expect(matches.length, 'fifth round does not run automatically').toBe(0);
  expect(tournament.run(), 'fifth round started manually').toBeTruthy();
  expect(matches.length, 'fifth round started').toBe(2);
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    t: [2, 5],
    i: 0,
    g: 4
  }, {
    t: [3, 4],
    i: 1,
    g: 4
  }];
  expect(ret, 'fifth round: correct teams in the matches').toEqual(ref);
  expect(tournament.getVotes('bye').get(0), 'fifth round: correct bye').toEqual(1);
  matches.get(0).finish([13, 5]);
  matches.get(0).finish([13, 7]);
  expect(state.get(), '5-team tournament finished after 5 rounds').toBe('finished');
  ret = tournament.getRanking().get();
  ref = {
    components: ['wins', 'sonneborn', 'saldo'],
    ids: [1, 2, 3, 4, 5],
    displayOrder: [0, 2, 1, 4, 3],
    ranks: [0, 2, 1, 4, 3],
    saldo: [31, 9, -6, 5, -9],
    sonneborn: [10, 4, 5, 2, 3],
    wins: [5, 3, 3, 2, 2]
  };
  expect(ret, 'final ranking is correct').toEqual(ref);
  data = tournament.save();
  expect(data, 'save() works').toBeTruthy();
  tournament = new RoundTournamentModel();
  expect(tournament, 'emptyconstruction works').toBeTruthy();
  matches = tournament.getMatches();
  byes = tournament.getVotes('bye');
  state = tournament.getState();
  expect(tournament.restore(data), 'restore() works').toBeTruthy();
  ret = tournament.getRanking().get();
  expect(ret, 'restored ranking is correct').toEqual(ref);

  /*
   * even number of teams
   */
  tournament = new RoundTournamentModel(['sonneborn']);
  tournament.addTeam(7);
  tournament.addTeam(5);
  tournament.addTeam(3);
  tournament.addTeam(2);
  expect(tournament, 'round tournament with 4 teams').toBeTruthy();
  matches = tournament.getMatches();
  byes = tournament.getVotes('bye');
  state = tournament.getState();
  tournament.run();
  expect(state.get(), 'tournament with 4 teams runs').toBe('running');
  expect(byes.length, 'no byes for 4 teams').toBe(0);
  expect(matches.length, 'two matches for 4 teams').toBe(2);
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    g: 0,
    i: 0,
    t: [7, 2]
  }, {
    g: 0,
    i: 1,
    t: [5, 3]
  }];
  expect(ret, 'round 1 for 4 teams has correct matches').toEqual(ref);
  matches.get(0).finish([13, 8]);
  matches.get(0).finish([10, 13]);
  tournament.run();
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    g: 1,
    i: 0,
    t: [7, 3]
  }, {
    g: 1,
    i: 1,
    t: [2, 5]
  }];
  expect(ret, 'round 2 for 4 teams has correct matches').toEqual(ref);
  matches.get(0).finish([3, 13]);
  matches.get(0).finish([13, 9]);
  tournament.run();
  ret = tournament.getMatches().asArray().map(function (match) {
    return {
      t: match.teams,
      i: match.getID(),
      g: match.getGroup()
    };
  });
  ref = [{
    g: 2,
    i: 0,
    t: [7, 5]
  }, {
    g: 2,
    i: 1,
    t: [3, 2]
  }];
  expect(ret, 'round 3 for 4 teams has correct matches').toEqual(ref);
  matches.get(0).finish([13, 4]);
  matches.get(0).finish([13, 9]);
  expect(state.get(), '4-team tournament is finished after 3 rounds').toBe('finished');

  /*
   * Check for duplications
   */

  for (numteams = 2; numteams <= 32; numteams += 1) {
    tournament = new RoundTournamentModel(['buchholz']); // buchholz implies gamematrix
    teams = tournament.getTeams();
    matches = tournament.getMatches();
    while (teams.length < numteams) {
      tournament.addTeam(teams.length);
    }
    while (tournament.getState().get() !== 'finished') {
      tournament.run();
      while (matches.length > 0) {
        matches.get(0).finish([13, 7]);
      }
    }
    ret = teams.map(function (teamno1, id1) {
      return teams.map(function (teamno2, id2) {
        return tournament.ranking.gamematrix.get(id1, id2);
      }).filter(function (occurences, id2) {
        return occurences !== 1 && id1 !== id2;
      });
    }).filter(function (duplications) {
      return duplications.length !== 0;
    });
    expect(ret, 'No duplications / omissions for ' + numteams + 'teams').toEqual([]);
  }
});