/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect } from 'vitest'

import './helpers/localstorage-stub.js'
import StateModel from '../statemodel.js'

test('the Supermêlée choice travels with the state', () => {
  const state = new StateModel()
  expect(state.melee.get(), 'fixed teams by default').toBe(false)

  state.melee.set(true)
  state.meleesize.set(3)
  const data = state.save()

  const restored = new StateModel()
  expect(restored.restore(data), 'restore succeeds').toBe(true)
  expect(restored.melee.get(), 'still a mêlée').toBe(true)
  expect(restored.meleesize.get(), 'triplettes').toBe(3)
})

test('a state written before the Supermêlée existed still restores', () => {
  const state = new StateModel()
  state.melee.set(true)
  const data = state.save()
  delete data.melee
  delete data.meleesize

  const restored = new StateModel()
  expect(restored.restore(data), 'restore succeeds').toBe(true)
  expect(restored.melee.get(), 'fixed teams').toBe(false)
})
