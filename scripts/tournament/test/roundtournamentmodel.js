/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, RoundTournamentModel, TournamentModel;

    extend = getModule("lib/extend");
    RoundTournamentModel = getModule("tournament/roundtournamentmodel");
    TournamentModel = getModule("tournament/tournamentmodel");

    QUnit.test("RoundTournamentModel", function (assert) {

      var tournament, ret, ref, data, numteams, matches, teams, byes, state;

      assert.ok(extend.isSubclass(RoundTournamentModel, TournamentModel),
        "RoundTournamentModel is subclass of TournamentModel");

      tournament = new RoundTournamentModel(["wins", "sonneborn", "saldo"]);
      assert.ok(tournament, "proper construction works");
      matches = tournament.getMatches();
      byes = tournament.getVotes("bye");
      state = tournament.getState();

      tournament.addTeam(1);
      assert.ok(!tournament.run(),
        "too few teams prohibit running the tournament");
      tournament.addTeam(2);
      tournament.addTeam(3);
      tournament.addTeam(4);
      tournament.addTeam(5);
      assert.ok(tournament.run(), "five teams work");
      assert.equal(matches.length, 2, "two games for 5 teams");

      assert.ok(matches.get(0).getID() < matches.get(1).getID(),
        "match ids are sorted");

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
      assert.deepEqual(ret, ref, "first round: correct teams in the matches");
      assert.deepEqual(byes.get(0), 5, "first round: correct bye");

      matches.get(0).finish([13, 7]);
      matches.get(0).finish([11, 13]);
      assert.equal(state.get(), "idle", "idle after games finished");

      assert.equal(matches.length, 0,
        "second round does not start automatically");
      assert.ok(tournament.run(), "second round starts manually");
      assert.equal(matches.length, 2, "second round started");
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
      assert.deepEqual(ret, ref, "second round: correct teams in the matches");
      assert.deepEqual(tournament.getVotes("bye").get(0), 4,
        "second round: correct bye");

      matches.get(0).finish([13, 4]);
      matches.get(0).finish([13, 8]);
      assert.equal(state.get(), "idle", "idle after games finished");

      assert.equal(matches.length, 0, "third round does not run automatically");
      assert.ok(tournament.run(), "third round started manually");
      assert.equal(matches.length, 2, "third round started");
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
      assert.deepEqual(ret, ref, "third round: correct teams in the matches");
      assert.deepEqual(tournament.getVotes("bye").get(0), 3,
        "third round: correct bye");

      matches.get(0).finish([11, 13]);
      matches.get(0).finish([10, 13]);
      assert.equal(state.get(), "idle", "idle after games finished");

      assert.equal(matches.length, 0,
        "fourth round does not start automatically");
      assert.ok(tournament.run(), "fourth round started manually");
      assert.equal(matches.length, 2, "fourth round started");
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
      assert.deepEqual(ret, ref, "fourth round: correct teams in the matches");
      assert.deepEqual(tournament.getVotes("bye").get(0), 2,
        "fourth round: correct bye");

      matches.get(0).finish([2, 13]);
      matches.get(0).finish([13, 0]);
      assert.equal(state.get(), "idle", "idle after games finished");

      assert.equal(matches.length, 0, "fifth round does not run automatically");
      assert.ok(tournament.run(), "fifth round started manually");
      assert.equal(matches.length, 2, "fifth round started");
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
      assert.deepEqual(ret, ref, "fifth round: correct teams in the matches");
      assert.deepEqual(tournament.getVotes("bye").get(0), 1,
        "fifth round: correct bye");

      matches.get(0).finish([13, 5]);
      matches.get(0).finish([13, 7]);
      assert.equal(state.get(), "finished",
        "5-team tournament finished after 5 rounds");

      ret = tournament.getRanking().get();
      ref = {
        components: ["wins", "sonneborn", "saldo"],
        ids: [1, 2, 3, 4, 5],
        displayOrder: [0, 2, 1, 4, 3],
        ranks: [0, 2, 1, 4, 3],
        saldo: [31, 9, -6, 5, -9],
        sonneborn: [10, 4, 5, 2, 3],
        wins: [5, 3, 3, 2, 2]
      };
      assert.deepEqual(ret, ref, "final ranking is correct");

      data = tournament.save();
      assert.ok(data, "save() works");

      tournament = new RoundTournamentModel();
      assert.ok(tournament, "emptyconstruction works");
      matches = tournament.getMatches();
      byes = tournament.getVotes("bye");
      state = tournament.getState();

      assert.ok(tournament.restore(data), "restore() works");
      ret = tournament.getRanking().get();
      assert.deepEqual(ret, ref, "restored ranking is correct");

      /*
       * even number of teams
       */
      tournament = new RoundTournamentModel(["sonneborn"]);
      tournament.addTeam(7);
      tournament.addTeam(5);
      tournament.addTeam(3);
      tournament.addTeam(2);

      assert.ok(tournament, "round tournament with 4 teams");

      matches = tournament.getMatches();
      byes = tournament.getVotes("bye");
      state = tournament.getState();

      tournament.run();
      assert.equal(state.get(), "running", "tournament with 4 teams runs");
      assert.equal(byes.length, 0, "no byes for 4 teams");
      assert.equal(matches.length, 2, "two matches for 4 teams");

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
      assert.deepEqual(ret, ref, "round 1 for 4 teams has correct matches");

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
      assert.deepEqual(ret, ref, "round 2 for 4 teams has correct matches");

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
      assert.deepEqual(ret, ref, "round 3 for 4 teams has correct matches");

      matches.get(0).finish([13, 4]);
      matches.get(0).finish([13, 9]);

      assert.equal(state.get(), "finished",
        "4-team tournament is finished after 3 rounds");


      /*
       * Check for duplications
       */

      for (numteams = 2; numteams <= 32; numteams += 1) {
        tournament = new RoundTournamentModel(["buchholz"]); // buchholz implies gamematrix
        teams = tournament.getTeams();
        matches = tournament.getMatches();

        while (teams.length < numteams) {
          tournament.addTeam(teams.length);
        }

        while (tournament.getState().get() !== "finished") {
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

        assert.deepEqual(ret, [], "No duplications / omissions for " + numteams + "teams");
      }
    });
  };
});
