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
    var MatchModel;

    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');

    QUnit.test('MatchModel', function() {
      var game, success, array, ref, listener, data;

      game = undefined;

      try {
        game = new MatchModel();
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'empty initialization should throw an error');

      game = undefined;
      try {
        game = new MatchModel([15]);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'game id is required. Throws an error otherwise');

      game = undefined;
      try {
        game = new MatchModel([15], 0);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'group is required. Throws an error otherwise');

      game = undefined;
      try {
        game = new MatchModel([], 0, 0);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success, 'empty teams array should throw an error');

      game = new MatchModel([15], 51, 5);

      QUnit.equal(game.getID(), 51, 'default id is 0');
      QUnit.equal(game.getGroup(), 5, 'default group is 0');
      QUnit.equal(game.getTeamID(-123), undefined, 'getTeamID below 0');
      QUnit.equal(game.getTeamID(1), undefined, 'getTeamID at game.length');
      QUnit.equal(game.getTeamID(12), undefined, 'getTeamID outside of range');
      QUnit.equal(game.getTeamID(0), 15, 'getTeamID inside range');

      array = [1, 2, 3, 4, 5];
      game = new MatchModel(array, 2, 3);
      array[3] = 321;
      QUnit.equal(game.getTeamID(3), 4, 'MatchModel() copies the team array');

      game = new MatchModel([1, 2], 0, 0);
      ref = new MatchResult(game, [13, 7]);

      listener = {
        finished: false,
        onfinish: function() {
          this.finished = true;
        },
        emitters: []
      };
      game.registerListener(listener);

      QUnit.equal(game.finish(), undefined, 'game.finish() fails');
      QUnit.equal(game.finish([]), undefined, 'game.finish([]) fails');
      QUnit.equal(game.finish([3, 2, 1]), undefined,
          'game.finish([3,2,1]) fails');
      QUnit.equal(listener.finished, false, 'no "finish" event sent yet');
      QUnit.deepEqual(game.finish([13, 7]), ref, 'game.finish([13,7]) works');
      QUnit.equal(listener.finished, true, '"finish" event sent yet');

      game = new MatchModel([4, 1, 2], 2, 3);
      data = game.save();
      QUnit.ok(data, 'save() returns something');
      game = new MatchModel([0, 1], 0, 0);
      QUnit.equal(game.restore(data), true, 'restore() works');
      QUnit.equal(game.length, 3, 'restore(): correct length');
      QUnit.equal(game.getID(), 2, 'restore(): correct id');
      QUnit.equal(game.getGroup(), 3, 'restore(): correct group');
      QUnit.equal(game.getTeamID(0), 4, 'restore(): correct team id 0');
      QUnit.equal(game.getTeamID(1), 1, 'restore(): correct team id 1');
      QUnit.equal(game.getTeamID(2), 2, 'restore(): correct team id 2');

    });
  };
});
