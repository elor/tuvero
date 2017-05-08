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
    var extend, CorrectionReferenceModel, CorrectionModel, MatchResult, MatchModel, ListModel;

    extend = getModule('lib/extend');
    CorrectionReferenceModel = getModule('core/correctionreferencemodel');
    CorrectionModel = getModule('core/correctionmodel');
    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');
    ListModel = getModule('list/listmodel');

    QUnit.test('CorrectionReferenceModel', function() {
      var result, result2, correction, reference, teams;
      QUnit.ok(extend.isSubclass(CorrectionReferenceModel, CorrectionModel),
          'CorrectionReferenceModel is subclass of CorrectionModel');

      teams = new ListModel();
      teams.push(5);
      teams.push(3);
      teams.push(6);
      teams.push(1);
      teams.push(13);
      teams.push(0);

      result = new MatchResult(new MatchModel([5, 3], 1, 2), [13, 7]);
      result2 = new MatchResult(new MatchModel([2, 4], 2, 1), [8, 9]);

      correction = new CorrectionModel(result, result2);

      reference = new CorrectionReferenceModel(correction, teams);
      QUnit.equal(reference.before.result, result,
          'before result reference is set');
      QUnit.equal(reference.after.result, result2,
          'after result reference is set');

      QUnit.deepEqual(reference.before.teams, [0, 1],
          'before teams correctly referenced');
      QUnit.deepEqual(reference.after.teams, [6, 13],
          'after teams correctly referenced');
      QUnit.deepEqual(reference.before.score, result.score,
          'before score is correct');
      QUnit.deepEqual(reference.after.score, result2.score,
          'after score is correct');

      QUnit.equal(reference.before.getID(), 1, 'before id matches');
      QUnit.equal(reference.after.getID(), 2, 'after id matches');
      QUnit.equal(reference.before.getGroup(), 2, 'before group matches');
      QUnit.equal(reference.after.getGroup(), 1, 'after group matches');
    });
  };
});
