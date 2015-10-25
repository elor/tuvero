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
    var extend, SwissTournamentModel, TournamentModel;

    extend = getModule('lib/extend');
    SwissTournamentModel = getModule('core/swisstournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');
    VectorModel = getModule('core/vectormodel');

    QUnit.test('SwissTournamentModel', function() {
      var groups, matches, byes, ups, downs, result, tournament;

      QUnit.ok(extend.isSubclass(SwissTournamentModel, TournamentModel),
          'SwissTournamentModel is subclass of TournamentModel');

      groups = [];
      byes = [];
      ups = [];
      downs = [];
      matches = [];
      tournament = new SwissTournamentModel();

      result = tournament.findSwissByesAndMatches(matches, byes, groups);
      QUnit.ok(result, 'findSwissByesAndMatches: empty groups array');

      tournament.addTeam(0);
      groups = [[0]];
      result = tournament.findSwissByesAndMatches(matches, byes, groups, ups,
          downs);
      QUnit.ok(result, 'findSwissByesAndMatches: single team');
      QUnit.deepEqual(byes, [0], 'single team: correct bye');

      tournament.addTeam(1);
      tournament.addTeam(2);
      tournament.addTeam(3);
      tournament.addTeam(4);
      groups = [[1, 2, 3, 4]];
      byes = [];
      ups = [];
      downs = [];

      result = tournament.findSwissByesAndMatches(matches, byes, groups, ups,
          downs);
      QUnit.ok(result, 'findSwissByesAndMatches: four teams');
      QUnit.deepEqual(matches, [[1, 2], [3, 4]], 'four teams: matches');

      groups = [[0, 1, 2, 3]];
      byes = [];
      ups = [];
      downs = [];
      matches = [];
      tournament.ranking.resize(tournament.length);
      tournament.ranking.winsmatrix.set(2, 3, 1);
      result = tournament.findSwissByesAndMatches(matches, byes, groups, ups,
          downs);
      QUnit.ok(result, 'findSwissByesAndMatches: already played');
      QUnit.deepEqual(matches, [[0, 2], [1, 3]], 'already played: matches');
    });
  };
});
