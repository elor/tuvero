/**
 * Unit tests for TimeMachineKeyModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, TimeMachineKeyModel, Model, Presets;

    extend = getModule('lib/extend');
    TimeMachineKeyModel = getModule('ui/timemachinekeymodel');
    Model = getModule('core/model');
    Presets = getModule('presets');

    QUnit.test('TimeMachineKeyModel', function() {
      var key, key2, ref, date;

      QUnit.ok(extend.isSubclass(TimeMachineKeyModel, Model),
          'TimeMachineKeyModel is subclass of Model');

      key = new TimeMachineKeyModel();
      QUnit.ok(key, 'empty initialization works (init-key)');
      QUnit.ok(key.toString(), 'init-key serialization works');
      QUnit.ok(key.startDate, 'init-key startDate is set');
      QUnit.ok(key.saveDate, 'init-key saveDate is set');
      QUnit.equal(key.startDate, key.saveDate, 'init-key dates match');
      QUnit.equal(key.target, Presets.target, 'init-key target matches');

      QUnit.equal(TimeMachineKeyModel.isValidKey(key.toString()), true,
          'serialized init-key is a valid key');
      QUnit.equal(key.isRelated(key), true,
          'init-key is actually related to itself');
      QUnit.equal(key.isRelated(key.toString()), true,
          'key string is related to itself');

      QUnit.equal(key.isEqual(key), true, 'key is equal to itself');
      QUnit.equal(key.isEqual(key.toString()), true,
          'key string is equal to itself');

      date = new Date(key.startDate);
      QUnit.ok(date, 'startDate can be converted to an instance of Date');
      QUnit.equal(date.toISOString(), key.startDate,
          'Date conversion is fully reversible');

      key2 = new TimeMachineKeyModel(key);

      QUnit.ok(key2, 'reference initialization works (save-key)');
      QUnit.ok(key2.toString(), 'save-key serialization works');
      QUnit.ok(key2.startDate, 'save-key startDate is set');
      QUnit.ok(key2.saveDate, 'save-key saveDate is set');
      QUnit.equal(key2.target, Presets.target,
          'save-key target matches current target');
      QUnit.notEqual(key2.startDate, key2.saveDate,
          'save-key dates are not equal');
      QUnit.equal(key2.startDate, key.startDate,
          'both keys have the same start date');

      date = new Date(key.saveDate);
      QUnit.ok(date, 'saveDate can be converted to an instance of Date');
      QUnit.equal(date.toISOString(), key.saveDate,
          'Date conversion is fully reversible');

      QUnit.equal(TimeMachineKeyModel.isValidKey(key2), true,
          'key2 is a valid key');

      QUnit.equal(key2.isEqual(key2), true, 'key2 is equal to itself');
      QUnit.equal(key2.isRelated(key2), true, 'key2 is related to itself');

      QUnit.equal(key.isRelated(key2), true, 'key is related to key2');
      QUnit.equal(key.isEqual(key2), false, 'key is not equal to key2');

      QUnit.equal(key.isRelated(key2), true, 'key is related to key2');
      QUnit.equal(key.isEqual(key2), false, 'key is not equal to key2');

      ref = 'test_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z';
      QUnit.equal(TimeMachineKeyModel.isValidKey(ref), true,
          'ref is a valid key: ' + ref);
      key = new TimeMachineKeyModel(ref);
      QUnit.ok(key, 'string-key construction works');
      QUnit.equal(key.toString(), ref, 'data is read and reconstructed as-is');
      QUnit.equal(key.isEqual(ref), true,
          'key is equal to its construction string');
      QUnit.equal(TimeMachineKeyModel.isValidKey(key), true,
          'string-constructed key is a valid key');
      QUnit.equal(key.isEqual(key2), false, 'unrelated keys are unequal');
      QUnit.equal(key.isRelated(key2), false, 'unrelated keys are unrelated');

      function testkey(keystring, keydescription) {
        var success = false;
        key = undefined;
        try {
          key = new TimeMachineKeyModel(keystring);
        } catch (e) {
          success = true;
        }

        if (key || keystring === undefined) {
          success = false;
        }

        QUnit.equal(success, true, 'forbidden key is intercepted: '
            + keydescription);
      }

      QUnit.ok(Presets.target, 'test', 'Tuvero Test target is "test"');

      key = undefined;
      testkey('', 'empty key');
      testkey('test_2016-02-11T17:36:50Z_2016-02-11T18:23:02Z',
          'missing milliseconds');
      testkey('test_2016-02-11T17:36:50.012Z', 'only one date');
      testkey('test_2016-02-11T17:36:50.123_2016-02-11T18:23:02.543',
          'Z missing');
      testkey('test_20160211T17:36:50.123Z_20160211T18:23:02.543Z',
          'date delimiters missing');
      testkey('test_2016-02-11T173650.123Z_2016-02-11T182302.543Z',
          'time delimiters missing');
      testkey('test-2016-02-11T17:36:50.123Z-2016-02-11T18:23:02.543Z',
          'wrong key delimiters');
      testkey('test__2016-02-11T17:36:50.123Z__2016-02-11T18:23:02.543Z',
          'too many key delimiters');
      testkey('rotz_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z',
          'unallowed target');
      testkey('boule_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z',
          'wrong target');
      testkey('2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z',
          'target missing');
      testkey('test_2016-02-11-17:36:50.123Z_2016-02-11-18:23:02.543Z',
          'T missing');
      testkey('test-saves', 'key for another model');
      testkey('TEST_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z',
          'wrong target case');
      testkey('test_2016-02-11T17:36:50.123z_2016-02-11T18:23:02.543z',
          'Z: wrong case');
      testkey('test_2016-02-11t17:36:50.123Z_2016-02-11t18:23:02.543Z',
          'T: wrong case');
    });
  };
});
