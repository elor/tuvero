/**
 * MatchResult tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  return function(QUnit, getModule) {
    var MatchModel, MatchResult;

    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');

    QUnit.test('MatchResult', function() {
      var match, result, score, success, teams, data;

      match = new MatchModel([1, 2], 2, 5);
      result = undefined;

      try {
        result = new MatchResult();
        success = true;
      } catch (e) {
        success = false;
      }

      QUnit.ok(success, 'empty construction works');
      QUnit.equal(result.match, undefined, 'empty construction -> no match');
      QUnit.deepEqual(result.teams, [], 'empty construction -> empty teams');
      QUnit.deepEqual(result.score, [], 'empty construction -> empty score');
      QUnit.deepEqual(result.getID(), -1, 'empty construction -> id == -1');
      QUnit.deepEqual(result.getGroup(), -1,
          'empty construction -> group == -1');

      score = [13, 7];
      try {
        result = new MatchResult(match, score);
        success = true;
      } catch (e) {
        success = false;
      }
      QUnit.ok(success, 'passing match as first argument');
      QUnit.equal(result.match, undefined,
          'result.match got kicked out of the API');
      QUnit.deepEqual(result.teams, match.teams, 'match teams match');
      QUnit.ok(result.teams !== match.teams, 'match teams are only copies');
      QUnit.deepEqual(result.score, score, 'scores match');
      QUnit.ok(result.score !== score, 'scores are only copies of another');
      QUnit.deepEqual(result.getID(), 2, 'keeping the id');
      QUnit.deepEqual(result.getGroup(), 5, 'keeping the group id');
      QUnit.equal(result.isBye(), false, 'result is not a bye');

      /*
       * create MatchResult from another MatchResult
       */

      score = [8, 12];
      result = new MatchResult(result, score);
      QUnit.ok(success, 'passing match as first argument');
      QUnit.equal(result.match, undefined,
          'result.match got kicked out of the API');
      QUnit.deepEqual(result.teams, match.teams, 'match teams match');
      QUnit.ok(result.teams !== match.teams, 'match teams are only copies');
      QUnit.deepEqual(result.score, score, 'scores match');
      QUnit.ok(result.score !== score, 'scores are only copies of another');
      QUnit.deepEqual(result.getID(), 2, 'keeping the id');
      QUnit.deepEqual(result.getGroup(), 5, 'keeping the group id');
      QUnit.equal(result.isBye(), false, 'result is not a bye');

      /*
       * incompatible API changes
       */

      teams = [5, 1];
      score = [5, 11];
      try {
        result = new MatchResult(teams, score);
        success = false;
      } catch (e) {
        success = true;
      }
      QUnit.ok(success,
          'construction with a team array does not work anymore (API change)');

      /*
       * save/restore
       */

      result = new MatchResult(new MatchModel([5, 3], 8, 1), [13, 7]);
      data = result.save();
      QUnit.ok(data, 'save() finishes');

      teams = [5, 3];
      score = [13, 7];
      result = new MatchResult();
      QUnit.ok(result.restore(data), 'restore() finishes');
      QUnit.equal(result.match, undefined, 'restore(): match not restored');
      QUnit.deepEqual(result.teams, teams, 'restore(): teams restored');
      QUnit.deepEqual(result.score, score, 'restore(): scores restored');
      QUnit.deepEqual(result.getID(), 8, 'restore(): id restored');
      QUnit.deepEqual(result.getGroup(), 1, 'restore(): group id restored');
      QUnit.equal(result.isBye(), false, 'result is not a bye');
    });
  };
});
