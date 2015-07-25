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
    var extend, SwissTournamentModel, TournamentModel, TriangleMatrixModel;

    extend = getModule('lib/extend');
    SwissTournamentModel = getModule('core/swisstournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');
    TriangleMatrixModel = getModule('core/trianglematrixmodel');
    VectorModel = getModule('core/vectormodel');

    QUnit.test('SwissTournamentModel', function() {
      var groups, matches, byes, result;

      QUnit.ok(extend.isSubclass(SwissTournamentModel, TournamentModel),
          'SwissTournamentModel is subclass of TournamentModel');

      groups = [];
      byes = [];
      matches = [];
      gamematrix = new TriangleMatrixModel(0);
      byevector = new VectorModel(0);

      result = SwissTournamentModel.findSwissByesAndMatches(matches, byes,
          groups, gamematrix, byevector);
      QUnit.ok(result, 'findSwissByesAndMatches: empty groups array');

      groups = [[5]];
      result = SwissTournamentModel.findSwissByesAndMatches(matches, byes,
          groups, gamematrix, byevector);
      QUnit.ok(result, 'findSwissByesAndMatches: single team');
      QUnit.deepEqual(byes, [5], 'single team: correct bye');

      groups = [[1, 2, 3, 4]];
      byes = [];
      result = SwissTournamentModel.findSwissByesAndMatches(matches, byes,
          groups, gamematrix, byevector);
      QUnit.ok(result, 'findSwissByesAndMatches: four teams');
      QUnit.deepEqual(matches, [[1, 2], [3, 4]], 'four teams: matches');
    });
  };
});
