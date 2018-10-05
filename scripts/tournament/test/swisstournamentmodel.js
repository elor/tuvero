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
    var extend, SwissTournamentModel, TournamentModel, VectorModel;

    extend = getModule("lib/extend");
    SwissTournamentModel = getModule("tournament/swisstournamentmodel");
    TournamentModel = getModule("tournament/tournamentmodel");
    VectorModel = getModule("math/vectormodel");

    QUnit.test("SwissTournamentModel", function (assert) {
      var groups, matches, votes, result, tournament;

      assert.ok(extend.isSubclass(SwissTournamentModel, TournamentModel),
          "SwissTournamentModel is subclass of TournamentModel");

      groups = [];
      votes = {};
      matches = [];
      tournament = new SwissTournamentModel();

      result = tournament.findSwissByesAndMatches(matches, votes, groups);
      assert.ok(result, "findSwissByesAndMatches: empty groups array");

      tournament.addTeam(0);
      groups = [[0]];
      result = tournament.findSwissByesAndMatches(matches, votes, groups);
      assert.ok(result, "findSwissByesAndMatches: single team");
      assert.deepEqual(votes.byes, [0], "single team: correct bye");

      tournament.addTeam(1);
      tournament.addTeam(2);
      tournament.addTeam(3);
      tournament.addTeam(4);
      groups = [[1, 2, 3, 4]];
      votes = {};

      result = tournament.findSwissByesAndMatches(matches, votes, groups);
      assert.ok(result, "findSwissByesAndMatches: four teams");
      assert.deepEqual(matches, [[1, 2], [3, 4]], "four teams: matches");

      groups = [[0, 1, 2, 3]];
      votes = {};
      matches = [];
      tournament.ranking.resize(tournament.length);
      tournament.ranking.winsmatrix.set(2, 3, 1);
      result = tournament.findSwissByesAndMatches(matches, votes, groups);
      assert.ok(result, "findSwissByesAndMatches: already played");
      assert.deepEqual(matches, [[0, 2], [1, 3]], "already played: matches");

      /*
       * tournament playthroughs/starts
       */

      tournament = new SwissTournamentModel(["wins"]);
      tournament.addTeam(5);
      tournament.addTeam(4);
      tournament.addTeam(3);
      tournament.addTeam(2);
      tournament.addTeam(1);
      tournament
          .setProperty("swissmode", SwissTournamentModel.MODES.individual);
      assert.ok(tournament.run(), "default test tournament");

      assert.deepEqual(tournament.getVotes("bye").asArray(), [1], "bye votes");
    });
  };
});
