/**
 * Unit tests for KeyModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, KeyModel, Model, Presets;

    extend = getModule("lib/extend");
    KeyModel = getModule("timemachine/keymodel");
    Model = getModule("core/model");
    Presets = getModule("presets");

    QUnit.test("KeyModel", function (assert) {
      var key, key2, ref, date;

      assert.ok(extend.isSubclass(KeyModel, Model),
          "KeyModel is subclass of Model");

      /*
       * init-key
       */

      key = KeyModel.createRoot();
      assert.ok(key, "empty initialization works (init-key)");
      assert.ok(key.toString(), "init-key serialization works");
      assert.ok(key.startDate, "init-key startDate is set");
      assert.ok(key.saveDate, "init-key saveDate is set");
      assert.equal(key.startDate, key.saveDate, "init-key dates match");
      assert.equal(key.target, Presets.target, "init-key target matches");

      assert.equal(KeyModel.isValidKey(key.toString()), true,
          "serialized init-key is a valid key");
      assert.equal(key.isRoot(), true,
          "init-key is an init key");
      assert.equal(key.isRelated(key), true,
          "init-key is actually related to itself");
      assert.equal(key.isRelated(key.toString()), true,
          "key string is related to itself");

      assert.equal(key.isEqual(key), true, "key is equal to itself");
      assert.equal(key.isEqual(key.toString()), true,
          "key string is equal to itself");

      date = new Date(key.startDate);
      assert.ok(date, "startDate can be converted to an instance of Date");
      assert.equal(date.toISOString(), key.startDate,
          "Date conversion is fully reversible");

      /*
       * save-keys
       */

      key2 = KeyModel.createChild(key);

      assert.ok(key2, "reference initialization works (save-key)");
      assert.ok(key2.toString(), "save-key serialization works");
      assert.ok(key2.startDate, "save-key startDate is set");
      assert.ok(key2.saveDate, "save-key saveDate is set");
      assert.equal(key2.target, Presets.target,
          "save-key target matches current target");
      assert.notEqual(key2.startDate, key2.saveDate,
          "save-key dates are not equal");
      assert.equal(key2.startDate, key.startDate,
          "both keys have the same start date");

      date = new Date(key.saveDate);
      assert.ok(date, "saveDate can be converted to an instance of Date");
      assert.equal(date.toISOString(), key.saveDate,
          "Date conversion is fully reversible");

      assert.equal(KeyModel.isValidKey(key2), true,
          "key2 is a valid key");
      assert.equal(key2.isRoot(), false,
          "save-key is no init key");

      assert.equal(key2.isEqual(key2), true, "key2 is equal to itself");
      assert.equal(key2.isRelated(key2), true, "key2 is related to itself");

      assert.equal(key.isRelated(key2), true, "key is related to key2");
      assert.equal(key.isEqual(key2), false, "key is not equal to key2");

      assert.equal(key.isRelated(key2), true, "key is related to key2");
      assert.equal(key.isEqual(key2), false, "key is not equal to key2");

      /*
       * string construction
       */

      ref = "test_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z";
      assert.equal(KeyModel.isValidKey(ref), true,
          "ref is a valid key: " + ref);
      key = KeyModel.fromString(ref);
      assert.ok(key, "string-key construction works");
      assert.equal(key.toString(), ref, "data is read and reconstructed as-is");
      assert.equal(key.isEqual(ref), true,
          "key is equal to its construction string");

      assert.equal(KeyModel.isValidKey(key), true,
          "string-constructed key is a valid key");
      assert.equal(key.isRoot(), false,
          "string-key is no init key");

      assert.equal(key.isEqual(key2), false, "unrelated keys are unequal");
      assert.equal(key.isRelated(key2), false, "unrelated keys are unrelated");

      /*
       * other targets
       */
      ref = "boule_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z";
      assert.equal(KeyModel.isTuveroKey(ref), true,
          "cross-target key is a tuvero key: " + ref);
      assert.equal(KeyModel.isValidKey(ref), false,
          "cross-target key is not valid: " + ref);

      ref = "basic_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z";
      assert.equal(KeyModel.isTuveroKey(ref), true,
          "cross-target key is a tuvero key: " + ref);
      assert.equal(KeyModel.isValidKey(ref), false,
          "cross-target key is not valid: " + ref);

      function testkey(keystring, keydescription) {
        var success = false;
        key = undefined;
        try {
          key = KeyModel.fromString(keystring);
        } catch (e) {
          success = true;
        }

        if (key || keystring === undefined) {
          success = false;
        }

        assert.equal(success, true, "forbidden key is intercepted: "
            + keydescription);
      }

      assert.ok(Presets.target, "test", "Tuvero Test target is \"test\"");

      key = undefined;
      testkey("", "empty key");
      testkey("test_2016-02-11T17:36:50Z_2016-02-11T18:23:02Z",
          "missing milliseconds");
      testkey("test_2016-02-11T17:36:50.012Z", "only one date");
      testkey("test_2016-02-11T17:36:50.123_2016-02-11T18:23:02.543",
          "Z missing");
      testkey("test_20160211T17:36:50.123Z_20160211T18:23:02.543Z",
          "date delimiters missing");
      testkey("test_2016-02-11T173650.123Z_2016-02-11T182302.543Z",
          "time delimiters missing");
      testkey("test-2016-02-11T17:36:50.123Z-2016-02-11T18:23:02.543Z",
          "wrong key delimiters");
      testkey("test__2016-02-11T17:36:50.123Z__2016-02-11T18:23:02.543Z",
          "too many key delimiters");
      testkey("rotz_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z",
          "unallowed target");
      testkey("boule_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z",
          "wrong target");
      testkey("2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z",
          "target missing");
      testkey("test_2016-02-11-17:36:50.123Z_2016-02-11-18:23:02.543Z",
          "T missing");
      testkey("test-saves", "key for another model");
      testkey("TEST_2016-02-11T17:36:50.123Z_2016-02-11T18:23:02.543Z",
          "wrong target case");
      testkey("test_2016-02-11T17:36:50.123z_2016-02-11T18:23:02.543z",
          "Z: wrong case");
      testkey("test_2016-02-11t17:36:50.123Z_2016-02-11t18:23:02.543Z",
          "T: wrong case");
    });
  };
});
