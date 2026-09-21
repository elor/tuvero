/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import { snakeGroups, planStep, stepReady, rankedTeams, unplacedTeams, schedule, minTeams, qualifiersPerGroup } from '../templateplan.js'
import { templateById } from '../templates.js'
import TournamentIndex from '../tournamentindex.js'

function teamIDs (count) {
  const ids = []
  while (ids.length < count) {
    ids.push(ids.length)
  }
  return ids
}

function playTournament (system, ids) {
  const tournament = TournamentIndex.createTournament(system, ['wins', 'id'])
  ids.forEach(function (id) {
    tournament.addTeam(id)
  })
  tournament.run()
  const matches = tournament.getMatches()
  while (matches.length) {
    // the team which was registered first always wins
    const match = matches.get(0)
    match.finish(match.getTeamID(0) < match.getTeamID(1) ? [13, 7] : [7, 13])
  }
  tournament.finish()
  return tournament
}

test('snake seeding spreads the strong teams over the groups', () => {
  expect(snakeGroups(teamIDs(8), 2), 'eight teams, two groups')
    .toEqual([[0, 3, 4, 7], [1, 2, 5, 6]])
  expect(snakeGroups(teamIDs(6), 3), 'six teams, three groups')
    .toEqual([[0, 5], [1, 4], [2, 3]])
  expect(snakeGroups(teamIDs(5), 2), 'an odd team lands in the first group')
    .toEqual([[0, 3, 4], [1, 2]])
  expect(snakeGroups(teamIDs(4), 1), 'a single group keeps the order')
    .toEqual([[0, 1, 2, 3]])
})

test('the first step splits everybody into the group phases', () => {
  const template = templateById('groupsfinal')
  const specs = planStep(template, 0, { teamIDs: teamIDs(16), tournaments: [] })

  expect(specs.length, 'two group phases').toBe(2)
  expect(specs[0].name, 'named by the template').toBe('Vorrunde A')
  expect(specs[1].name, 'named by the template').toBe('Vorrunde B')
  expect(specs[0].system, 'swiss system').toBe('swiss')
  expect(specs[0].teamIDs.length, 'half the teams').toBe(8)
  expect(specs[1].teamIDs.length, 'the other half').toBe(8)
  expect(specs[0].startIndex, 'group A leads the global ranking').toBe(0)
  expect(specs[1].startIndex, 'group B follows it').toBe(8)
})

test('the final takes the best of every group, seeded across them', () => {
  const template = templateById('groupsfinal')
  // group A: 0, 3, 4, 7, 8, 11, 12, 15 — group B: 1, 2, 5, 6, 9, 10, 13, 14
  const groups = planStep(template, 0, { teamIDs: teamIDs(16), tournaments: [] })
  const played = groups.map(function (spec) {
    return playTournament(spec.system, spec.teamIDs)
  })

  const specs = planStep(template, 1, { teamIDs: teamIDs(16), tournaments: [played] })
  expect(specs.length, 'a single final').toBe(1)
  expect(specs[0].name, 'named by the template').toBe('Finale')
  expect(specs[0].system, 'played as a KO round').toBe('ko')
  expect(specs[0].teamIDs.length, 'the best four of each group').toBe(8)
  expect(specs[0].startIndex, 'the final leads the global ranking').toBe(0)

  const a = rankedTeams(played[0])
  const b = rankedTeams(played[1])
  expect(specs[0].teamIDs, 'A1, B1, A2, B2, …').toEqual([
    a[0], b[0], a[1], b[1], a[2], b[2], a[3], b[3]
  ])
})

test('the placement round picks up everybody who did not qualify', () => {
  const template = templateById('groupsfinal')
  const groups = planStep(template, 0, { teamIDs: teamIDs(16), tournaments: [] })
  const played = groups.map(function (spec) {
    return playTournament(spec.system, spec.teamIDs)
  })
  const final = planStep(template, 1, { teamIDs: teamIDs(16), tournaments: [played] })
  const finaltournament = playTournament(final[0].system, final[0].teamIDs)

  const specs = planStep(template, 2, {
    teamIDs: teamIDs(16),
    tournaments: [played, [finaltournament]]
  })
  expect(specs.length, 'a single placement round').toBe(1)
  expect(specs[0].name, 'named by the template').toBe('Platzierungsrunde')
  expect(specs[0].teamIDs.length, 'the remaining eight').toBe(8)
  expect(specs[0].startIndex, 'below the finalists').toBe(8)
  final[0].teamIDs.forEach(function (teamID) {
    expect(specs[0].teamIDs.indexOf(teamID), 'no finalist plays here').toBe(-1)
  })

  const a = rankedTeams(played[0])
  const b = rankedTeams(played[1])
  expect(specs[0].teamIDs, 'A5, B5, A6, B6, …').toEqual([
    a[4], b[4], a[5], b[5], a[6], b[6], a[7], b[7]
  ])
})

test('a late registration joins the placement round', () => {
  const template = templateById('groupsfinal')
  const groups = planStep(template, 0, { teamIDs: teamIDs(8), tournaments: [] })
  const played = groups.map(function (spec) {
    return playTournament(spec.system, spec.teamIDs)
  })
  const final = planStep(template, 1, { teamIDs: teamIDs(8), tournaments: [played] })
  const finaltournament = playTournament(final[0].system, final[0].teamIDs)

  const specs = planStep(template, 2, {
    teamIDs: teamIDs(10),
    tournaments: [played, [finaltournament]]
  })
  expect(specs[0].teamIDs.indexOf(8), 'the new team is in').toBeGreaterThan(-1)
  expect(specs[0].teamIDs.indexOf(9), 'and so is the next one').toBeGreaterThan(-1)
})

test('a step waits for the previous phases to finish', () => {
  const template = templateById('groupsfinal')
  const groups = planStep(template, 0, { teamIDs: teamIDs(16), tournaments: [] })
  expect(stepReady(template, 0, { tournaments: [] }), 'the first step is ready')
    .toBe(true)

  const running = TournamentIndex.createTournament('swiss', ['wins', 'id'])
  groups[0].teamIDs.forEach(function (id) {
    running.addTeam(id)
  })
  running.run()
  expect(stepReady(template, 1, { tournaments: [[running]] }), 'not while it runs')
    .toBe(false)

  const played = groups.map(function (spec) {
    return playTournament(spec.system, spec.teamIDs)
  })
  expect(stepReady(template, 1, { tournaments: [played] }), 'but once they are done')
    .toBe(true)
})

test('the Maastricht system splits the field into KO brackets of eight', () => {
  const template = templateById('maastricht')
  const groups = planStep(template, 0, { teamIDs: teamIDs(29), tournaments: [] })
  expect(groups.length, 'a single qualifying phase').toBe(1)
  const played = [playTournament(groups[0].system, groups[0].teamIDs)]

  const specs = planStep(template, 1, { teamIDs: teamIDs(29), tournaments: [played] })
  expect(specs.map(function (spec) { return spec.name }), 'four brackets')
    .toEqual(['A-Turnier', 'B-Turnier', 'C-Turnier', 'D-Turnier'])
  expect(specs.map(function (spec) { return spec.teamIDs.length }), '8, 8, 8, 5')
    .toEqual([8, 8, 8, 5])
  expect(specs.map(function (spec) { return spec.startIndex }), 'one below the other')
    .toEqual([0, 8, 16, 24])

  const ranked = rankedTeams(played[0])
  expect(specs[0].teamIDs, 'the best eight play the A tournament')
    .toEqual(ranked.slice(0, 8))
  expect(specs[3].teamIDs, 'the rest play the D tournament')
    .toEqual(ranked.slice(24))
})

test('a single leftover team hangs over instead of bloating a bracket', () => {
  const template = templateById('maastricht')
  const groups = planStep(template, 0, { teamIDs: teamIDs(33), tournaments: [] })
  const played = [playTournament(groups[0].system, groups[0].teamIDs)]
  const context = { teamIDs: teamIDs(33), tournaments: [played] }

  const specs = planStep(template, 1, context)
  expect(specs.map(function (spec) { return spec.teamIDs.length }), 'four times eight')
    .toEqual([8, 8, 8, 8])

  const ranked = rankedTeams(played[0])
  expect(unplacedTeams(template, 1, context), 'the last team has no tournament')
    .toEqual([ranked[32]])
})

test('two leftover teams still play each other', () => {
  const template = templateById('maastricht')
  const groups = planStep(template, 0, { teamIDs: teamIDs(18), tournaments: [] })
  const played = [playTournament(groups[0].system, groups[0].teamIDs)]
  const context = { teamIDs: teamIDs(18), tournaments: [played] }

  expect(planStep(template, 1, context).map(function (spec) {
    return spec.teamIDs.length
  }), 'eight, eight and a single match').toEqual([8, 8, 2])
  expect(unplacedTeams(template, 1, context), 'nobody is left out').toEqual([])
})

test('the schedule spells out every phase and adds them up', () => {
  const maastricht = templateById('maastricht')
  expect(schedule(maastricht, { rounds: 4, kosize: 8 }), 'four and three')
    .toMatchObject({
      lines: ['4 Vorrunden', 'bis zu 3 KO-Runden'],
      total: '7 Runden insgesamt',
      note: ''
    })
  expect(schedule(maastricht, { rounds: 1, kosize: 4 }).lines, 'the singulars')
    .toEqual(['eine Vorrunde', 'bis zu 2 KO-Runden'])
  expect(schedule(maastricht, { rounds: 3, kosize: 16 }), 'three plus four')
    .toMatchObject({ rounds: 7, matches: 7 })

  // the placement round is played alongside the final, so it adds
  // neither a round to the tournament nor a match to a single team
  const groupsfinal = templateById('groupsfinal')
  expect(schedule(groupsfinal, { rounds: 5, kosize: 8 }), 'five and three')
    .toMatchObject({
      rounds: 8,
      matches: 8,
      lines: [
        '5 Vorrunden',
        'bis zu 3 Runden im Finale',
        'parallel dazu eine Runde Platzierungsrunde'
      ],
      total: '8 Runden insgesamt',
      note: ''
    })
})

test('the KO size decides the qualifiers and the smallest field', () => {
  const groupsfinal = templateById('groupsfinal')
  expect(qualifiersPerGroup(2, { kosize: 8 }), 'four of each group').toBe(4)
  expect(qualifiersPerGroup(2, { kosize: 16 }), 'eight of each group').toBe(8)
  expect(minTeams(groupsfinal, { kosize: 8 }), 'and two left over').toBe(10)
  expect(minTeams(groupsfinal, { kosize: 16 }), 'grows with the final').toBe(18)
  expect(minTeams(templateById('maastricht'), { kosize: 8 }), 'two per group')
    .toBe(2)
})
