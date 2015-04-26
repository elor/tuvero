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
    var extend, TournamentModel, PropertyModel;

    extend = getModule('lib/extend');
    TournamentModel = getModule('core/tournamentmodel');
    PropertyModel = getModule('core/propertymodel');

    QUnit.test('TournamentModel', function() {
      QUnit.ok(extend.isSubclass(TournamentModel, PropertyModel), 'TournamentModel is subclass of PropertyModel');

      // TODO write tests for TournamentModel
      QUnit.ok(false, 'TODO: write tests for TournamentModel');
    });
  };
});
