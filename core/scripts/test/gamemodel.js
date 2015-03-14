/**
 * unit test
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var GameModel;

    GameModel = getModule('core/gamemodel');

    QUnit.test('GameModel', function() {
      var game, success, array;

      game = undefined;

      try {
        game = new GameModel();
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'empty initialization should throw an error');

      game = undefined;
      try {
        game = new GameModel([15]);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'game id is required. Throws an error otherwise');

      game = undefined;
      try {
        game = new GameModel([15], 0);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'group is required. Throws an error otherwise');

      game = undefined;
      try {
        game = new GameModel([], 0, 0);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'empty teams array should throw an error');

      game = new GameModel([15], 51, 5);

      QUnit.equal(game.getID(), 51, 'default id is 0');
      QUnit.equal(game.getGroup(), 5, 'default group is 0');
      QUnit.equal(game.getTeamID(-123), undefined, 'getTeamID below 0');
      QUnit.equal(game.getTeamID(1), undefined, 'getTeamID at game.length');
      QUnit.equal(game.getTeamID(12), undefined, 'getTeamID outside of range');
      QUnit.equal(game.getTeamID(0), 15, 'getTeamID inside range');

      array = [1, 2, 3, 4, 5];
      game = new GameModel(array, 2, 3);
      array[3] = 321;
      QUnit.equal(game.getTeamID(3), 4, 'GameModel() copies the team array');
    });
  };
});
