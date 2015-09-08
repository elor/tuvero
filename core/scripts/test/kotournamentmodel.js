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
    var extend, KOTournamentModel, TournamentModel;

    extend = getModule('lib/extend');
    KOTournamentModel = getModule('core/kotournamentmodel');
    TournamentModel = getModule('core/tournamentmodel');

    QUnit.test('KOTournamentModel', function() {
      QUnit.ok(extend.isSubclass(KOTournamentModel, TournamentModel), 'KOTournamentModel is subclass of TournamentModel');

      // TODO write tests for KOTournamentModel
      QUnit.ok(false, 'TODO: write tests for KOTournamentModel');
    });
  };
});
