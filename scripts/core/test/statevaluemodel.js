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
    var StateValueModel;

    StateValueModel = getModule("core/statevaluemodel");

    QUnit.test("StateValueModel", function (assert) {
      var state, transitions;

      transitions = {
        a: ["b", "c"],
        b: ["a"],
        c: []
      };

      state = new StateValueModel("a", transitions);

      assert.equal(state.get(), "a", "initial state is accepted");

      state.set(undefined);
      assert.equal(state.get(), "a",
          "ignoring invalid state transition (undefined)");

      assert.equal(state.set("d"), false, "unallowed transition (\"d\")");
      assert.equal(state.set("b"), true, "valid state transition (\"b\")");
      assert.equal(state.get(), "b", "state actually transitioned");
      assert.equal(state.set("b"), true, "transition to current state");
      assert.equal(state.set("c"), false, "unallowed transition (\"d\")");
      assert.equal(state.set("a"), true, "valid state transition (\"a\")");
      assert.equal(state.set("c"), true, "valid state transition (\"a\")");

      assert.equal(state.forceState("invalidstate"), false,
          "forceState() cannot force a nonexistant state");
      assert.equal(state.get(), "c", "state is at \"c\"");
      assert.equal(state.set("a"), false, "transition to state \"a\" is invalid");
      assert.equal(state.forceState("a"), true,
          "transition to state \"a\" can be enforced");
      assert.equal(state.get(), "a", "state was forced to be \"a\"");

    });
  };
});
