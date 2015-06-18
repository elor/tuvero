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
    var Model, Emitter, extend;

    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');

    QUnit.test('MatchResult', function() {
      var match, result, score, success, teams, data;

      match = new MatchModel([1, 2], 0, 0);
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

      score = [13, 7];
      try {
        result = new MatchResult(match, score);
        success = true;
      } catch (e) {
        success = false;
      }
      QUnit.ok(success, 'passing match as first argument');
      QUnit.equal(result.match, match, 'result.match contains original match');
      QUnit.deepEqual(result.teams, match.teams, 'match teams match');
      QUnit.ok(result.teams !== match.teams, 'match teams are only copies');
      QUnit.deepEqual(result.score, score, 'scores match');
      QUnit.ok(result.score !== score, 'scores are only copies of another');

      teams = [5, 1];
      score = [5, 11];
      try {
        result = new MatchResult(teams, score);
        success = true;
      } catch (e) {
        success = false;
      }
      QUnit.ok(success, 'passing team array as first argument');
      QUnit.equal(result.match, undefined, 'result.match is undefined');
      QUnit.deepEqual(result.teams, teams, 'teams match');
      QUnit.ok(result.teams !== teams, 'match teams are copies');
      QUnit.deepEqual(result.score, score, 'scores match');
      QUnit.ok(result.score !== score, 'scores are only copies of another');

      data = result.save();
      QUnit.ok(data, 'save() finishes');

      result = new MatchResult();
      QUnit.ok(result.restore(data), 'restore() finishes');
      QUnit.equal(result.match, undefined, 'restore(): match not restored');
      QUnit.deepEqual(result.teams, teams, 'restore(): teams restored');
      QUnit.deepEqual(result.score, score, 'restore(): scores restored');
    });
  };
});
