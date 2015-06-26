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
    ListModel = getModule('core/listmodel');

    QUnit.test('CorrectionReferenceModel', function() {
      var match, match2, result, result2, correction, reference, teams;
      QUnit.ok(extend.isSubclass(CorrectionReferenceModel, CorrectionModel),
          'CorrectionReferenceModel is subclass of CorrectionModel');

      teams = new ListModel();
      teams.push(5);
      teams.push(3);
      teams.push(6);
      teams.push(1);
      teams.push(13);
      teams.push(0);

      match = new MatchModel([5, 3], 1, 2);
      result = new MatchResult(match, [13, 7]);
      match2 = new MatchModel([2, 4], 2, 1);
      result2 = new MatchResult(match2, [8, 9]);

      correction = new CorrectionModel(result, result2);

      reference = new CorrectionReferenceModel(correction, teams);
      QUnit.equal(reference.before.result, result);
      QUnit.equal(reference.after.result, result2);
    });
  };
});
