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
    var extend, SwissTournamentModel, TournamentModel, SymmetricMatrixModel;

    extend = getModule('lib/extend');
    SwissTournamentModel = getModule('core/swisstournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');
    SymmetricMatrixModel = getModule('core/symmetricmatrixmodel');
    VectorModel = getModule('core/vectormodel');

    QUnit.test('SwissTournamentModel', function() {
      var groups, matches, byes, result;

      QUnit.ok(extend.isSubclass(SwissTournamentModel, TournamentModel),
          'SwissTournamentModel is subclass of TournamentModel');

      groups = [];
      byes = [];
      matches = [];
      gamematrix = new SymmetricMatrixModel(0);
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
      gamematrix = new SymmetricMatrixModel(5);

      result = SwissTournamentModel.findSwissByesAndMatches(matches, byes,
          groups, gamematrix, byevector);
      QUnit.ok(result, 'findSwissByesAndMatches: four teams');
      QUnit.deepEqual(matches, [[1, 2], [3, 4]], 'four teams: matches');

      groups = [[0, 1, 2, 3]];
      byes = [];
      matches = [];
      gamematrix = new SymmetricMatrixModel(4);
      gamematrix.set(2, 3, 1);
      result = SwissTournamentModel.findSwissByesAndMatches(matches, byes,
          groups, gamematrix, byevector);
      QUnit.ok(result, 'findSwissByesAndMatches: already played');
      QUnit.deepEqual(matches, [[0, 2], [1, 3]], 'already played: matches');
    });
  };
});
