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
import collectMatches from '../teammatches.js'
import IndexedListModel from '../../list/indexedlistmodel.js'
import ListModel from '../../list/listmodel.js'
import TeamModel from '../teammodel.js'
import PlayerModel from '../playermodel.js'
import RoundTournamentModel from '../../tournament/roundtournamentmodel.js'
import MeleeTournamentModel from '../../tournament/meleetournamentmodel.js'

function buildTeams (names) {
  const teams = new IndexedListModel()
  names.forEach(function (name) {
    const player = new PlayerModel()
    player.setName(name)
    teams.push(new TeamModel([player]))
  })
  return teams
}

function playAll (tournament, score) {
  const matches = tournament.getMatches()
  while (matches.length) {
    matches.get(0).finish(score)
  }
}

test('a team sees its own matches, with opponent and result', () => {
  const teams = buildTeams(['Anna', 'Ben', 'Cleo', 'Dan'])
  const tournament = new RoundTournamentModel(['wins'])
  teams.forEach(function (team, id) {
    tournament.addTeam(id)
  })
  tournament.getName().set('Rundenturnier')
  tournament.run()
  playAll(tournament, [13, 7])

  const tournaments = new ListModel([tournament])
  const rows = collectMatches(tournaments, teams.get(0), teams)

  expect(rows.length, 'one match in the first round').toBe(1)
  const row = rows[0]
  expect(row.tournament, 'names the tournament').toBe('Rundenturnier')
  expect(row.round, 'first round').toBe(1)
  expect(row.opponents.length, 'one opponent').toBe(1)
  expect(row.opponents[0].name, 'not itself').not.toBe('Anna')
  expect(row.opponents[0].team, 'and it leads to their team')
    .toBe(teams.get(row.opponents[0].team.getID()))
  expect(row.partners, 'nobody to share a team with').toEqual([])
  expect(row.score, 'from this team\'s point of view').toEqual([13, 7])
  expect(row.outcome).toBe('won')
})

test('a Supermêlée player sees who they played with and against', () => {
  const teams = buildTeams(['Anna', 'Ben', 'Cleo', 'Dan'])
  const melee = new MeleeTournamentModel(['wins', 'saldo', 'points'])
  teams.forEach(function (team, id) {
    melee.addTeam(id)
  })
  melee.getName().set('Supermêlée')
  melee.run()
  playAll(melee, [13, 5])

  const rows = collectMatches(new ListModel([melee]), teams.get(0), teams)

  expect(rows.length, 'one match').toBe(1)
  const row = rows[0]
  expect(row.partners.length, 'one partner in a doublette').toBe(1)
  expect(row.partners[0].name, 'not itself').not.toBe('Anna')
  expect(row.partners[0].team, 'the partner has a team of their own')
    .toBeTruthy()
  expect(row.opponents.length, 'two opponents').toBe(2)
  expect(row.opponents.map(function (o) { return o.name }),
    'and they are somebody else').not.toContain('Anna')
  expect(['won', 'lost'], 'decided').toContain(row.outcome)
})

test('a bye is listed as one', () => {
  const teams = buildTeams(['Anna', 'Ben', 'Cleo'])
  const tournament = new RoundTournamentModel(['wins'])
  teams.forEach(function (team, id) {
    tournament.addTeam(id)
  })
  tournament.run()

  const benched = tournament.getVotes('bye').asArray()[0]
  const rows = collectMatches(new ListModel([tournament]), teams.get(benched), teams)

  expect(rows.length, 'the bye shows up').toBe(1)
  expect(rows[0].outcome, 'as a bye').toBe('bye')
  expect(rows[0].opponents, 'without an opponent').toEqual([])
})

test('an open match comes with the match, so it can be finished', () => {
  const teams = buildTeams(['Anna', 'Ben', 'Cleo', 'Dan'])
  const tournament = new RoundTournamentModel(['wins'])
  teams.forEach(function (team, id) {
    tournament.addTeam(id)
  })
  tournament.run()

  const rows = collectMatches(new ListModel([tournament]), teams.get(0), teams)
  const row = rows[0]
  expect(row.match, 'the match travels with the row').toBeTruthy()
  expect([0, 1], 'and which side is ours').toContain(row.own)

  // finishing it from here counts for the right side
  const points = []
  points[row.own] = 13
  points[1 - row.own] = 4
  row.match.finish(points)

  const after = collectMatches(new ListModel([tournament]), teams.get(0), teams)
  expect(after[0].score, 'our points first').toEqual([13, 4])
  expect(after[0].outcome).toBe('won')
})

test('open matches are listed without a result', () => {
  const teams = buildTeams(['Anna', 'Ben'])
  const tournament = new RoundTournamentModel(['wins'])
  teams.forEach(function (team, id) {
    tournament.addTeam(id)
  })
  tournament.run()

  const rows = collectMatches(new ListModel([tournament]), teams.get(0), teams)
  expect(rows.length).toBe(1)
  expect(rows[0].outcome, 'still to be played').toBe('open')
  expect(rows[0].score).toBeUndefined()
})
