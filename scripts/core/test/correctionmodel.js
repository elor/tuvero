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
    var extend, MatchModel, MatchResult, CorrectionModel, Model;

    extend = getModule('lib/extend');
    MatchModel = getModule('core/matchmodel');
    MatchResult = getModule('core/matchresult');
    CorrectionModel = getModule('core/correctionmodel');
    Model = getModule('core/model');

    QUnit.test('CorrectionModel', function (assert) {
      var match, result, result2, correction, data, success;

      assert.ok(extend.isSubclass(CorrectionModel, Model),
          'CorrectionModel is subclass of Model');

      match = new MatchModel([1, 4], 0, 1);
      result = new MatchResult(match, [13, 7]);
      result2 = new MatchResult(result, [7, 13]);
      correction = new CorrectionModel(result, result2);

      assert.ok(correction, 'construction works');
      assert.equal(correction.before, result, "'before' stored as reference");
      assert.equal(correction.after, result2, "'after' stored as reference");

      /*
       * erronuous construction -> throw
       */
      try {
        correction = new CorrectionModel('asd', {
          pi: 3
        });
        success = false;
      } catch (e) {
        success = true;
      }

      assert.ok(success, 'the constructor throws on invalid values');

      /*
       * default construction
       */

      correction = new CorrectionModel();
      assert.ok(correction, 'default construction works');
      assert.deepEqual(correction.before, new MatchResult(),
          'default construction of pre-correction result');
      assert.deepEqual(correction.after, new MatchResult(),
          'default construction of post-correction result');

      /*
       * save/restore
       */
      correction = new CorrectionModel(result, result2);
      data = correction.save();
      assert.ok(data, 'save() returns');

      correction = new CorrectionModel();
      assert.ok(correction.restore(data), 'restore() returns');
      assert.deepEqual(correction.before, result,
          'restore() restores the pre-correction result');
      assert.deepEqual(correction.after, result2,
          'restore() restores the post-correction result');
    });
  };
});
