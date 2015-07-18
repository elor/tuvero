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

    QUnit.test('SwissTournamentModel', function() {
      QUnit.ok(extend.isSubclass(SwissTournamentModel, TournamentModel),
          'SwissTournamentModel is subclass of TournamentModel');

    });
  };
});
