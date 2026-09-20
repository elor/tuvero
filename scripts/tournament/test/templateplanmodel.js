/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import TemplatePlanModel from '../templateplanmodel.js'

test('a fresh plan is inactive', () => {
  const plan = new TemplatePlanModel()
  expect(plan.isActive(), 'no template yet').toBe(false)
  expect(plan.getTemplate(), 'and none to read').toBe(undefined)
  expect(plan.nextStep(), 'nothing to do').toBe(-1)
})

test('a plan walks through the steps of its template', () => {
  const plan = new TemplatePlanModel()
  expect(plan.start('groupsfinal'), 'the template exists').toBe(true)
  expect(plan.isActive(), 'the plan is running').toBe(true)
  expect(plan.getTemplate().name, 'and knows its template')
    .toBe('Vorrunde A/B mit Finale')
  expect(plan.nextStep(), 'the group phases come first').toBe(0)

  plan.record(0, [0, 1])
  expect(plan.nextStep(), 'then the final').toBe(1)
  plan.record(1, [2])
  expect(plan.nextStep(), 'then the placement round').toBe(2)
  plan.record(2, [3])
  expect(plan.nextStep(), 'and then it is over').toBe(-1)
  expect(plan.isFinished(), 'which the plan says out loud').toBe(true)
})

test('an unknown template is refused', () => {
  const plan = new TemplatePlanModel()
  expect(plan.start('nosuchtemplate'), 'no such template').toBe(false)
  expect(plan.isActive(), 'so nothing starts').toBe(false)
})

test('the plan tells which tournaments belong to which step', () => {
  const plan = new TemplatePlanModel()
  plan.start('groupsfinal')
  plan.record(0, [0, 1])
  const list = { get: (id) => (id < 2 ? { id } : undefined) }
  expect(plan.tournamentsByStep(list), 'both group phases')
    .toEqual([[{ id: 0 }, { id: 1 }]])

  plan.record(1, [7])
  expect(plan.tournamentsByStep(list)[1], 'a deleted tournament is dropped')
    .toEqual([])
})

test('a plan survives a save/restore round trip', () => {
  const plan = new TemplatePlanModel()
  plan.start('groupsfinal')
  plan.record(0, [0, 1])
  const data = plan.save()

  const restored = new TemplatePlanModel()
  expect(restored.restore(data), 'restores').toBe(true)
  expect(restored.getTemplate().id, 'the same template').toBe('groupsfinal')
  expect(restored.nextStep(), 'at the same point').toBe(1)
})

test('clearing a plan forgets everything', () => {
  const plan = new TemplatePlanModel()
  plan.start('groupsfinal')
  plan.record(0, [0, 1])
  plan.clear()
  expect(plan.isActive(), 'no plan anymore').toBe(false)
  expect(plan.steps, 'and no phases either').toEqual([])
})
