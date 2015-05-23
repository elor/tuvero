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
    var MatchModel, MatchResult, Listener;

    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');
    Listener = getModule('core/listener');

    QUnit.test('MatchModel', function() {
      var game, array, ref, listener, data;

      game = new MatchModel();
      QUnit.ok(game, 'empty initialization works');

      game = new MatchModel([15]);
      QUnit.ok(game, 'empty game id still instantiates the MatchModel.');
      QUnit.equal(game.getID(), -1, 'game id default to -1');

      game = new MatchModel([15], 0);
      QUnit.ok(game, 'empty group still instantiates the MatchModel');
      QUnit.equal(game.getGroup(), -1, 'group defaults to -1');

      game = new MatchModel([], 0, 0);
      QUnit.ok(game, 'empty teams array still works');

      game = new MatchModel([15], 51, 5);

      QUnit.equal(game.getID(), 51, 'id is correct');
      QUnit.equal(game.getGroup(), 5, 'group is correct');
      QUnit.equal(game.length, 1, 'game.length is correct');
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

      listener = new Listener();
      listener.finished = false;
      listener.onfinish = function() {
        this.finished = true;
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
      game = new MatchModel();
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
