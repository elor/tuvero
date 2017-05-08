/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, RoundTournamentModel, TournamentModel, matches, byes, state;

    extend = getModule('lib/extend');
    RoundTournamentModel = getModule('tournament/roundtournamentmodel');
    TournamentModel = getModule('tournament/tournamentmodel');

    QUnit.test('RoundTournamentModel', function() {
      var tournament, ret, ref, data;

      QUnit.ok(extend.isSubclass(RoundTournamentModel, TournamentModel),
          'RoundTournamentModel is subclass of TournamentModel');

      tournament = new RoundTournamentModel(['wins', 'sonneborn', 'saldo']);
      QUnit.ok(tournament, 'proper construction works');
      matches = tournament.getMatches();
      byes = tournament.getVotes('bye');
      state = tournament.getState();

      tournament.addTeam(1);
      QUnit.ok(!tournament.run(),
          'too few teams prohibit running the tournament');
      tournament.addTeam(2);
      tournament.addTeam(3);
      tournament.addTeam(4);
      tournament.addTeam(5);
      QUnit.ok(tournament.run(), 'five teams work');
      QUnit.equal(matches.length, 2, 'two games for 5 teams');

      QUnit.ok(matches.get(0).getID() < matches.get(1).getID(),
          'match ids are sorted');

      ret = matches.map(function(match) {
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
      QUnit.deepEqual(ret, ref, 'first round: correct teams in the matches');
      QUnit.deepEqual(byes.get(0), 5, 'first round: correct bye');

      matches.get(0).finish([13, 7]);
      matches.get(0).finish([11, 13]);
      QUnit.equal(state.get(), 'idle', 'idle after games finished');

      QUnit.equal(matches.length, 0,
          'second round does not start automatically');
      QUnit.ok(tournament.run(), 'second round starts manually');
      QUnit.equal(matches.length, 2, 'second round started');
      ret = tournament.getMatches().asArray().map(function(match) {
        return {
          t: match.teams,
          i: match.getID(),
          g: match.getGroup()
        };
      });
      ref = [{
        t: [1, 3],
        i: 0,
        g: 1
      }, {
        t: [5, 2],
        i: 1,
        g: 1
      }];
      QUnit.deepEqual(ret, ref, 'second round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 4,
          'second round: correct bye');

      matches.get(0).finish([13, 4]);
      matches.get(0).finish([13, 8]);
      QUnit.equal(state.get(), 'idle', 'idle after games finished');

      QUnit.equal(matches.length, 0, 'third round does not run automatically');
      QUnit.ok(tournament.run(), 'third round started manually');
      QUnit.equal(matches.length, 2, 'third round started');
      ret = tournament.getMatches().asArray().map(function(match) {
        return {
          t: match.teams,
          i: match.getID(),
          g: match.getGroup()
        };
      });
      ref = [{
        t: [1, 2],
        i: 0,
        g: 2
      }, {
        t: [4, 5],
        i: 1,
        g: 2
      }];
      QUnit.deepEqual(ret, ref, 'third round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 3,
          'third round: correct bye');

      matches.get(0).finish([11, 13]);
      matches.get(0).finish([10, 13]);
      QUnit.equal(state.get(), 'idle', 'idle after games finished');

      QUnit.equal(matches.length, 0,
          'fourth round does not start automatically');
      QUnit.ok(tournament.run(), 'fourth round started manually');
      QUnit.equal(matches.length, 2, 'fourth round started');
      ret = tournament.getMatches().asArray().map(function(match) {
        return {
          t: match.teams,
          i: match.getID(),
          g: match.getGroup()
        };
      });
      ref = [{
        t: [1, 5],
        i: 0,
        g: 3
      }, {
        t: [3, 4],
        i: 1,
        g: 3
      }];
      QUnit.deepEqual(ret, ref, 'fourth round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 2,
          'fourth round: correct bye');

      matches.get(0).finish([13, 2]);
      matches.get(0).finish([13, 0]);
      QUnit.equal(state.get(), 'idle', 'idle after games finished');

      QUnit.equal(matches.length, 0, 'fifth round does not run automatically');
      QUnit.ok(tournament.run(), 'fifth round started manually');
      QUnit.equal(matches.length, 2, 'fifth round started');
      ret = tournament.getMatches().asArray().map(function(match) {
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
      QUnit.deepEqual(ret, ref, 'fifth round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 1,
          'fifth round: correct bye');

      matches.get(0).finish([13, 5]);
      matches.get(0).finish([7, 13]);
      QUnit.equal(state.get(), 'finished',
          '5-team tournament finished after 5 rounds');

      ret = tournament.getRanking().get();
      ref = {
        components: ['wins', 'sonneborn', 'saldo'],
        ids: [1, 2, 3, 4, 5],
        displayOrder: [0, 1, 2, 4, 3],
        ranks: [0, 1, 2, 4, 3],
        saldo: [30, 9, 6, -10, -5],
        sonneborn: [8, 7, 5, 3, 5],
        wins: [4, 3, 3, 2, 3]
      };
      QUnit.deepEqual(ret, ref, 'final ranking is correct');

      data = tournament.save();
      QUnit.ok(data, 'save() works');

      tournament = new RoundTournamentModel();
      QUnit.ok(tournament, 'emptyconstruction works');
      matches = tournament.getMatches();
      byes = tournament.getVotes('bye');
      state = tournament.getState();

      QUnit.ok(tournament.restore(data), 'restore() works');
      ret = tournament.getRanking().get();
      QUnit.deepEqual(ret, ref, 'restored ranking is correct');

      /*
       * even number of teams
       */
      tournament = new RoundTournamentModel(['sonneborn']);
      tournament.addTeam(7);
      tournament.addTeam(5);
      tournament.addTeam(3);
      tournament.addTeam(2);

      QUnit.ok(tournament, 'round tournament with 4 teams');

      matches = tournament.getMatches();
      byes = tournament.getVotes('bye');
      state = tournament.getState();

      tournament.run();
      QUnit.equal(state.get(), 'running', 'tournament with 4 teams runs');
      QUnit.equal(byes.length, 0, 'no byes for 4 teams');
      QUnit.equal(matches.length, 2, 'two matches for 4 teams');

      ret = tournament.getMatches().asArray().map(function(match) {
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
      QUnit.deepEqual(ret, ref, 'round 1 for 4 teams has correct matches');

      matches.get(0).finish([13, 8]);
      matches.get(0).finish([10, 13]);

      tournament.run();
      ret = tournament.getMatches().asArray().map(function(match) {
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
      QUnit.deepEqual(ret, ref, 'round 2 for 4 teams has correct matches');

      matches.get(0).finish([3, 13]);
      matches.get(0).finish([13, 9]);

      tournament.run();
      ret = tournament.getMatches().asArray().map(function(match) {
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
      QUnit.deepEqual(ret, ref, 'round 3 for 4 teams has correct matches');

      matches.get(0).finish([13, 4]);
      matches.get(0).finish([13, 9]);

      QUnit.equal(state.get(), 'finished',
          '4-team tournament is finished after 3 rounds');

    });
  };
});
