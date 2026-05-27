/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import StateValueModel from '../statevaluemodel.js'
test('StateValueModel', () => {
    const transitions = {
    a: ['b', 'c'],
    b: ['a'],
    c: []
  }
  const state = new StateValueModel('a', transitions)
  expect(state.get(), 'initial state is accepted').toBe('a')
  state.set(undefined)
  expect(state.get(), 'ignoring invalid state transition (undefined)').toBe('a')
  expect(state.set('d'), 'unallowed transition ("d")').toBe(false)
  expect(state.set('b'), 'valid state transition ("b")').toBe(true)
  expect(state.get(), 'state actually transitioned').toBe('b')
  expect(state.set('b'), 'transition to current state').toBe(true)
  expect(state.set('c'), 'unallowed transition ("d")').toBe(false)
  expect(state.set('a'), 'valid state transition ("a")').toBe(true)
  expect(state.set('c'), 'valid state transition ("a")').toBe(true)
  expect(
    state.forceState('invalidstate'),
    'forceState() cannot force a nonexistant state'
  ).toBe(false)
  expect(state.get(), 'state is at "c"').toBe('c')
  expect(state.set('a'), 'transition to state "a" is invalid').toBe(false)
  expect(state.forceState('a'), 'transition to state "a" can be enforced').toBe(true)
  expect(state.get(), 'state was forced to be "a"').toBe('a')
})
