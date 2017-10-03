/**
 * unit test
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var MatchModel, MatchResult, Listener;

    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');
    Listener = getModule('core/listener');

    QUnit.test('MatchModel', function (assert) {
      var game, array, ref, listener, data;

      game = new MatchModel();
      assert.ok(game, 'empty initialization works');

      game = new MatchModel([15]);
      assert.ok(game, 'empty game id still instantiates the MatchModel.');
      assert.equal(game.getID(), -1, 'game id default to -1');

      game = new MatchModel([15], 0);
      assert.ok(game, 'empty group still instantiates the MatchModel');
      assert.equal(game.getGroup(), -1, 'group defaults to -1');

      game = new MatchModel([], 0, 0);
      assert.ok(game, 'empty teams array still works');

      game = new MatchModel([15], 51, 5);

      assert.equal(game.getID(), 51, 'id is correct');
      assert.equal(game.getGroup(), 5, 'group is correct');
      assert.equal(game.length, 1, 'game.length is correct');
      assert.equal(game.getTeamID(-123), undefined, 'getTeamID below 0');
      assert.equal(game.getTeamID(1), undefined, 'getTeamID at game.length');
      assert.equal(game.getTeamID(12), undefined, 'getTeamID outside of range');
      assert.equal(game.getTeamID(0), 15, 'getTeamID inside range');

      array = [1, 2, 3, 4, 5];
      game = new MatchModel(array, 2, 3);
      array[3] = 321;
      assert.equal(game.getTeamID(3), 4, 'MatchModel() copies the team array');

      game = new MatchModel([1, 2], 0, 0);
      ref = new MatchResult(game, [13, 7]);

      listener = new Listener();
      listener.finished = false;
      listener.onfinish = function() {
        this.finished = true;
      };
      game.registerListener(listener);

      assert.equal(game.finish(), undefined, 'game.finish() fails');
      assert.equal(game.finish([]), undefined, 'game.finish([]) fails');
      assert.equal(game.finish([3, 2, 1]), undefined,
          'game.finish([3,2,1]) fails');
      assert.equal(listener.finished, false, 'no "finish" event sent yet');
      assert.deepEqual(game.finish([13, 7]), ref, 'game.finish([13,7]) works');
      assert.equal(listener.finished, true, '"finish" event sent yet');

      game = new MatchModel([4, 1, 2], 2, 3);
      data = game.save();
      assert.ok(data, 'save() returns something');
      game = new MatchModel();
      assert.equal(game.restore(data), true, 'restore() works');
      assert.equal(game.length, 3, 'restore(): correct length');
      assert.equal(game.getID(), 2, 'restore(): correct id');
      assert.equal(game.getGroup(), 3, 'restore(): correct group');
      assert.equal(game.getTeamID(0), 4, 'restore(): correct team id 0');
      assert.equal(game.getTeamID(1), 1, 'restore(): correct team id 1');
      assert.equal(game.getTeamID(2), 2, 'restore(): correct team id 2');

      /*
       * isRunningMatch()
       */
      game = new MatchModel([0, 1], 0, 0);
      assert.ok(game.isRunningMatch(), 'isRunningMatch() of a typical match');

      game = new MatchModel([0, 0], 0, 0);
      assert.equal(game.isRunningMatch(), false,
          'isRunningMatch() of a match with duplicate teams');

      game = new MatchModel([0, undefined], 0, 0);
      assert.equal(game.isRunningMatch(), false,
          'isRunningMatch() of a match with an undefined team');

      /*
       * save() with an undefined team
       */
      data = game.save();
      assert.ok(data, 'save() with undefined team succeeds');
      game = new MatchModel();
      assert.equal(game.restore(data), true,
          'restore() with undefined team works');
      assert.equal(game.getTeamID(1), undefined,
          'second team still is undefined');
    });
  };
});
