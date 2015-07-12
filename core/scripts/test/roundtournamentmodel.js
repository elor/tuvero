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
    RoundTournamentModel = getModule('core/roundtournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');

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
        t: [5, 3],
        i: 0,
        g: 1
      }, {
        t: [1, 2],
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
        t: [4, 2],
        i: 0,
        g: 2
      }, {
        t: [5, 1],
        i: 1,
        g: 2
      }];
      QUnit.deepEqual(ret, ref, 'third round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 3,
          'third round: correct bye');

      matches.get(0).finish([11, 13]);
      matches.get(0).finish([11, 10]);
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
        t: [3, 1],
        i: 0,
        g: 3
      }, {
        t: [4, 5],
        i: 1,
        g: 3
      }];
      QUnit.deepEqual(ret, ref, 'fourth round: correct teams in the matches');
      QUnit.deepEqual(tournament.getVotes('bye').get(0), 2,
          'fourth round: correct bye');

      matches.get(0).finish([2, 13]);
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
      QUnit.equal(state.get(), 'finished', 'finished after the last round');

      ret = tournament.getRanking().get();
      ref = {
        components: ['wins', 'sonneborn', 'saldo'],
        ids: [1, 2, 3, 4, 5],
        displayOrder: [1, 2, 5, 4, 3],
        ranks: [0, 1, 4, 3, 2],
        saldo: [21, 3, -24, 11, -11],
        sonneborn: [5, 4, 2, 3, 4],
        wins: [3, 2, 1, 2, 2]
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
      QUnit.deepEqual(ret, ref, 'final ranking is correct');
    });
  };
});
