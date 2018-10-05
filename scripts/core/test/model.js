/**
 * Model class tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var Model, Emitter, extend;

    Model = getModule("core/model");
    Emitter = getModule("core/emitter");
    extend = getModule("lib/extend");

    QUnit.test("Model", function (assert) {
      var model, success;

      assert.ok(extend.isSubclass(Model, Emitter),
          "Model is an Emitter subclass");

      model = new Model();

      assert.deepEqual(model.save(), {}, "Model.save() returns empty object");

      try {
        assert.equal(model.restore({}), true,
            "Model.restore() returns true on success");
        success = true;
      } catch (e) {
        success = false;
      }
      assert.ok(success, "model.restore() exists and is a function");

    });
  };
});
