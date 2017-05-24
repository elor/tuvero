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
    var extend, ByeResult, MatchResult;

    extend = getModule('lib/extend');
    ByeResult = getModule('core/byeresult');
    MatchResult = getModule('core/matchresult');

    QUnit.test('ByeResult', function(assert) {
      var bye, data;

      assert.ok(extend.isSubclass(ByeResult, MatchResult),
          'ByeResult is subclass of MatchResult');

      /*
       * construction
       */
      bye = new ByeResult(5, [13, 7], 3, 9);
      assert.equal(bye.getID(), 3, 'id matches the argument');
      assert.equal(bye.getGroup(), 9, 'group matches the argument');
      assert.equal(bye.length, 2, 'bye has two teams');
      assert.equal(bye.getTeamID(0), 5, 'first team matches the argument');
      assert.equal(bye.getTeamID(1), 5, 'second team matches the argument');
      assert.deepEqual(bye.score, [13, 7], 'score matches the argument');
      assert.equal(bye.isBye(), true, 'bye.isBye() is true');

      /*
       * save/restore
       */
      data = bye.save();
      assert.ok(data, 'save() returns');

      // Not a typo. Bye is supposed to be converted into a matchresult.
      bye = new MatchResult();
      assert.ok(bye.restore(data), 'restore() returns');
      assert.equal(bye.getID(), 3, 'id matches the argument');
      assert.equal(bye.getGroup(), 9, 'group matches the argument');
      assert.equal(bye.length, 2, 'bye has two teams');
      assert.equal(bye.getTeamID(0), 5, 'first team matches the argument');
      assert.equal(bye.getTeamID(1), 5, 'second team matches the argument');
      assert.deepEqual(bye.score, [13, 7], 'score matches the argument');
      assert.equal(bye.isBye(), true, 'bye.isBye() is true');

      /*
       * isRunningMatch()
       */
      assert.equal(bye.isRunningMatch(), false, 'byes are not running matches');
    });
  };
});
