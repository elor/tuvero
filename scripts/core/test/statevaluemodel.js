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
    var StateValueModel;

    StateValueModel = getModule('core/statevaluemodel');

    QUnit.test('StateValueModel', function() {
      var state, transitions;

      transitions = {
        a: ['b', 'c'],
        b: ['a'],
        c: []
      };

      state = new StateValueModel('a', transitions);

      QUnit.equal(state.get(), 'a', 'initial state is accepted');

      state.set(undefined);
      QUnit.equal(state.get(), 'a',
          'ignoring invalid state transition (undefined)');

      QUnit.equal(state.set('d'), false, 'unallowed transition ("d")');
      QUnit.equal(state.set('b'), true, 'valid state transition ("b")');
      QUnit.equal(state.get(), 'b', 'state actually transitioned');
      QUnit.equal(state.set('b'), true, 'transition to current state');
      QUnit.equal(state.set('c'), false, 'unallowed transition ("d")');
      QUnit.equal(state.set('a'), true, 'valid state transition ("a")');
      QUnit.equal(state.set('c'), true, 'valid state transition ("a")');

      QUnit.equal(state.forceState('invalidstate'), false,
          'forceState() cannot force a nonexistant state');
      QUnit.equal(state.get(), 'c', 'state is at "c"');
      QUnit.equal(state.set('a'), false, 'transition to state "a" is invalid');
      QUnit.equal(state.forceState('a'), true,
          'transition to state "a" can be enforced');
      QUnit.equal(state.get(), 'a', 'state was forced to be "a"');

    });
  };
});
