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

    QUnit.test('ByeResult', function() {
      var bye, data;

      QUnit.ok(extend.isSubclass(ByeResult, MatchResult),
          'ByeResult is subclass of MatchResult');

      /*
       * construction
       */
      bye = new ByeResult(5, [13, 7], 3, 9);
      QUnit.equal(bye.getID(), 3, 'id matches the argument');
      QUnit.equal(bye.getGroup(), 9, 'group matches the argument');
      QUnit.equal(bye.length, 2, 'bye has two teams');
      QUnit.equal(bye.getTeamID(0), 5, 'first team matches the argument');
      QUnit.equal(bye.getTeamID(1), 5, 'second team matches the argument');
      QUnit.deepEqual(bye.score, [13, 7], 'score matches the argument');
      QUnit.equal(bye.isBye(), true, 'bye.isBye() is true');

      /*
       * save/restore
       */
      data = bye.save();
      QUnit.ok(data, 'save() returns');

      // Not a typo. Bye is supposed to be converted into a matchresult.
      bye = new MatchResult();
      QUnit.ok(bye.restore(data), 'restore() returns');
      QUnit.equal(bye.getID(), 3, 'id matches the argument');
      QUnit.equal(bye.getGroup(), 9, 'group matches the argument');
      QUnit.equal(bye.length, 2, 'bye has two teams');
      QUnit.equal(bye.getTeamID(0), 5, 'first team matches the argument');
      QUnit.equal(bye.getTeamID(1), 5, 'second team matches the argument');
      QUnit.deepEqual(bye.score, [13, 7], 'score matches the argument');
      QUnit.equal(bye.isBye(), true, 'bye.isBye() is true');

    });
  };
});
