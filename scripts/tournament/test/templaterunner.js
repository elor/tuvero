/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import { startNextStep, canStartNextStep } from '../templaterunner.js'
import TemplatePlanModel from '../templateplanmodel.js'
import TournamentListModel from '../tournamentlistmodel.js'

function teamIDs (count) {
  const ids = []
  while (ids.length < count) {
    ids.push(ids.length)
  }
  return ids
}

function playAll (tournament) {
  tournament.run()
  const matches = tournament.getMatches()
  while (matches.length) {
    matches.get(0).finish([13, 7])
  }
  tournament.finish()
}

test('starting a step creates its phases', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')

  expect(canStartNextStep(plan, teamIDs(16), tournaments), 'ready to go').toBe(true)
  expect(startNextStep(plan, teamIDs(16), tournaments), 'creates them').toBe(true)

  expect(tournaments.length, 'two group phases').toBe(2)
  expect(tournaments.get(0).getName().get(), 'named after the template')
    .toBe('Vorrunde A')
  expect(tournaments.get(1).getName().get(), 'and the second one too')
    .toBe('Vorrunde B')
  expect(tournaments.get(0).SYSTEM, 'played in the swiss system').toBe('swiss')
  expect(tournaments.startIndex.get(1), 'group B follows group A').toBe(8)
  expect(plan.nextStep(), 'the final is next').toBe(1)
})

test('the next step waits for the running phases', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  startNextStep(plan, teamIDs(16), tournaments)

  expect(canStartNextStep(plan, teamIDs(16), tournaments), 'not yet').toBe(false)
  expect(startNextStep(plan, teamIDs(16), tournaments), 'and refuses to').toBe(false)
  expect(tournaments.length, 'nothing was created').toBe(2)

  tournaments.forEach(playAll)
  expect(canStartNextStep(plan, teamIDs(16), tournaments), 'now it can').toBe(true)
  expect(startNextStep(plan, teamIDs(16), tournaments), 'and does').toBe(true)
  expect(tournaments.length, 'the final was added').toBe(3)
  expect(tournaments.get(2).getName().get(), 'named Finale').toBe('Finale')
  expect(tournaments.get(2).SYSTEM, 'a KO round').toBe('ko')
  expect(tournaments.startIndex.get(2), 'the finalists lead the ranking').toBe(0)
})

test('a finished plan has nothing left to start', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  let guard = 0
  while (canStartNextStep(plan, teamIDs(16), tournaments) && guard++ < 10) {
    startNextStep(plan, teamIDs(16), tournaments)
    tournaments.forEach(playAll)
  }
  expect(plan.isFinished(), 'all three steps were played').toBe(true)
  expect(canStartNextStep(plan, teamIDs(16), tournaments), 'and that is it')
    .toBe(false)
  expect(tournaments.length, 'groups, final and placement round').toBe(4)
})

test('a template needs enough teams', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  expect(canStartNextStep(plan, teamIDs(3), tournaments), 'three is not enough')
    .toBe(false)
})
