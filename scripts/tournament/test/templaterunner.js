/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import { startNextStep, canStartNextStep, canAdvance, advanceToNextStep, canStartRound, startPendingRounds } from '../templaterunner.js'
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

test('the smallest allowed field still fills every phase', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  let guard = 0
  while (canStartNextStep(plan, teamIDs(10), tournaments) && guard++ < 10) {
    startNextStep(plan, teamIDs(10), tournaments)
    tournaments.forEach(playAll)
  }
  expect(plan.isFinished(), 'the plan ran to its end').toBe(true)
  expect(tournaments.length, 'two groups, a final and a placement round')
    .toBe(4)
  expect(tournaments.get(3).getTeams().length, 'the two teams left over')
    .toBe(2)
})

test('the Maastricht system draws every bracket at once', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('maastricht')
  startNextStep(plan, teamIDs(20), tournaments)
  expect(tournaments.length, 'the qualifying phase').toBe(1)

  tournaments.forEach(playAll)
  expect(startNextStep(plan, teamIDs(20), tournaments), 'the brackets follow')
    .toBe(true)
  expect(tournaments.length, 'three KO tournaments were added').toBe(4)
  expect(tournaments.get(1).getName().get(), 'the best eight').toBe('A-Turnier')
  expect(tournaments.get(3).getName().get(), 'and the last four').toBe('C-Turnier')
  expect(tournaments.get(3).getTeams().length, 'four teams left').toBe(4)
  expect(plan.isFinished(), 'and that is the whole system').toBe(true)
})

function playOpenMatches (tournaments) {
  tournaments.forEach(function (tournament) {
    const matches = tournament.getMatches()
    while (matches.length) {
      matches.get(0).finish([13, 7])
    }
  })
}

test('one button starts the pending round in every phase', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  startNextStep(plan, teamIDs(16), tournaments)

  expect(canStartRound(plan, tournaments), 'both phases are waiting').toBe(true)
  expect(startPendingRounds(plan, tournaments), 'both were started').toBe(2)
  expect(canStartRound(plan, tournaments), 'nothing left to start').toBe(false)

  playOpenMatches(tournaments)
  expect(canStartRound(plan, tournaments), 'the next round is due').toBe(true)
})

test('the next step ends the running phases on its way', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('groupsfinal')
  advanceToNextStep(plan, teamIDs(16), tournaments)
  expect(tournaments.get(0).getState().get(), 'drawn and started').toBe('running')

  expect(canAdvance(plan, teamIDs(16), tournaments), 'not while they run').toBe(false)
  playOpenMatches(tournaments)
  expect(canAdvance(plan, teamIDs(16), tournaments), 'but once the round is in')
    .toBe(true)

  expect(advanceToNextStep(plan, teamIDs(16), tournaments), 'draws the final')
    .toBe(true)
  expect(tournaments.get(0).getState().get(), 'the groups were finished')
    .toBe('finished')
  expect(tournaments.get(1).getState().get(), 'both of them').toBe('finished')
  expect(tournaments.length, 'and the final was added').toBe(3)
  expect(tournaments.get(2).getState().get(), 'already running').toBe('running')
})

test('the qualifying phase stops after the configured rounds', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('maastricht')
  expect(plan.setOption('rounds', 2), 'two rounds, please').toBe(true)
  advanceToNextStep(plan, teamIDs(16), tournaments)

  playOpenMatches(tournaments)
  expect(canStartRound(plan, tournaments), 'one more round to play').toBe(true)
  startPendingRounds(plan, tournaments)
  playOpenMatches(tournaments)
  expect(canStartRound(plan, tournaments), 'that was the second').toBe(false)
  expect(canAdvance(plan, teamIDs(16), tournaments), 'on to the KO phase')
    .toBe(true)
  expect(plan.setOption('rounds', 5), 'too late to change the plan').toBe(false)
})

test('the KO size decides how the field is cut', () => {
  const plan = new TemplatePlanModel()
  const tournaments = new TournamentListModel()
  plan.start('maastricht')
  plan.setOption('kosize', 4)
  advanceToNextStep(plan, teamIDs(16), tournaments)
  playOpenMatches(tournaments)
  advanceToNextStep(plan, teamIDs(16), tournaments)

  expect(tournaments.length, 'four brackets of four').toBe(5)
  expect(tournaments.get(4).getTeams().length, 'the last four').toBe(4)
})
