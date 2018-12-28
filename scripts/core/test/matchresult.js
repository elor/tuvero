/**
 * MatchResult tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  return function (QUnit, getModule) {
    var MatchModel, MatchResult

    MatchModel = getModule('core/matchmodel')
    MatchResult = getModule('core/matchresult')

    QUnit.test('MatchResult', function (assert) {
      var match, result, score, success, teams, data

      match = new MatchModel([1, 2], 2, 5)
      result = undefined

      try {
        result = new MatchResult()
        success = true
      } catch (e) {
        success = false
      }

      assert.ok(success, 'empty construction works')
      assert.equal(result.match, undefined, 'empty construction -> no match')
      assert.deepEqual(result.teams, [], 'empty construction -> empty teams')
      assert.deepEqual(result.score, [], 'empty construction -> empty score')
      assert.deepEqual(result.getID(), -1, 'empty construction -> id == -1')
      assert.deepEqual(result.getGroup(), -1,
        'empty construction -> group == -1')

      score = [13, 7]
      try {
        result = new MatchResult(match, score)
        success = true
      } catch (e) {
        success = false
      }
      assert.ok(success, 'passing match as first argument')
      assert.equal(result.match, undefined,
        'result.match got kicked out of the API')
      assert.deepEqual(result.teams, match.teams, 'match teams match')
      assert.ok(result.teams !== match.teams, 'match teams are only copies')
      assert.deepEqual(result.score, score, 'scores match')
      assert.ok(result.score !== score, 'scores are only copies of another')
      assert.deepEqual(result.getID(), 2, 'keeping the id')
      assert.deepEqual(result.getGroup(), 5, 'keeping the group id')
      assert.equal(result.isBye(), false, 'result is not a bye')

      /*
       * create MatchResult from another MatchResult
       */

      score = [8, 12]
      result = new MatchResult(result, score)
      assert.ok(success, 'passing match as first argument')
      assert.equal(result.match, undefined,
        'result.match got kicked out of the API')
      assert.deepEqual(result.teams, match.teams, 'match teams match')
      assert.ok(result.teams !== match.teams, 'match teams are only copies')
      assert.deepEqual(result.score, score, 'scores match')
      assert.ok(result.score !== score, 'scores are only copies of another')
      assert.deepEqual(result.getID(), 2, 'keeping the id')
      assert.deepEqual(result.getGroup(), 5, 'keeping the group id')
      assert.equal(result.isBye(), false, 'result is not a bye')

      /*
       * incompatible API changes
       */

      teams = [5, 1]
      score = [5, 11]
      try {
        result = new MatchResult(teams, score)
        success = false
      } catch (e) {
        success = true
      }
      assert.ok(success,
        'construction with a team array does not work anymore (API change)')

      /*
       * save/restore
       */

      result = new MatchResult(new MatchModel([5, 3], 8, 1), [13, 7])
      data = result.save()
      assert.ok(data, 'save() finishes')

      teams = [5, 3]
      score = [13, 7]
      result = new MatchResult()
      assert.ok(result.restore(data), 'restore() finishes')
      assert.equal(result.match, undefined, 'restore(): match not restored')
      assert.deepEqual(result.teams, teams, 'restore(): teams restored')
      assert.deepEqual(result.score, score, 'restore(): scores restored')
      assert.deepEqual(result.getID(), 8, 'restore(): id restored')
      assert.deepEqual(result.getGroup(), 1, 'restore(): group id restored')
      assert.equal(result.isBye(), false, 'result is not a bye')

      /*
       * isRunningMatch()
       */
      assert.equal(result.isRunningMatch(), false,
        'results are not running matches')
    })
  }
})
