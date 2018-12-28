/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, CorrectionReferenceModel, CorrectionModel, MatchResult, MatchModel, ListModel

    extend = getModule('lib/extend')
    CorrectionReferenceModel = getModule('core/correctionreferencemodel')
    CorrectionModel = getModule('core/correctionmodel')
    MatchModel = getModule('core/matchmodel')
    MatchResult = getModule('core/matchresult')
    ListModel = getModule('list/listmodel')

    QUnit.test('CorrectionReferenceModel', function (assert) {
      var result, result2, correction, reference, teams
      assert.ok(extend.isSubclass(CorrectionReferenceModel, CorrectionModel),
        'CorrectionReferenceModel is subclass of CorrectionModel')

      teams = new ListModel()
      teams.push(5)
      teams.push(3)
      teams.push(6)
      teams.push(1)
      teams.push(13)
      teams.push(0)

      result = new MatchResult(new MatchModel([5, 3], 1, 2), [13, 7])
      result2 = new MatchResult(new MatchModel([2, 4], 2, 1), [8, 9])

      correction = new CorrectionModel(result, result2)

      reference = new CorrectionReferenceModel(correction, teams)
      assert.equal(reference.before.result, result,
        'before result reference is set')
      assert.equal(reference.after.result, result2,
        'after result reference is set')

      assert.deepEqual(reference.before.teams, [0, 1],
        'before teams correctly referenced')
      assert.deepEqual(reference.after.teams, [6, 13],
        'after teams correctly referenced')
      assert.deepEqual(reference.before.score, result.score,
        'before score is correct')
      assert.deepEqual(reference.after.score, result2.score,
        'after score is correct')

      assert.equal(reference.before.getID(), 1, 'before id matches')
      assert.equal(reference.after.getID(), 2, 'after id matches')
      assert.equal(reference.before.getGroup(), 2, 'before group matches')
      assert.equal(reference.after.getGroup(), 1, 'after group matches')
    })
  }
})
