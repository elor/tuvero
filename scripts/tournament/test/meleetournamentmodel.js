/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import MeleeTournamentModel from '../meleetournamentmodel.js'
import TournamentModel from '../tournamentmodel.js'

const RANKING = ['wins', 'saldo', 'points']

function melee (players) {
  const tournament = new MeleeTournamentModel(RANKING)
  for (let player = 0; player < players; player += 1) {
    tournament.addTeam(100 + player)
  }
  return tournament
}

test('MeleeTournamentModel: a round draws line-ups, not fixed teams', () => {
  expect(
    MeleeTournamentModel.prototype instanceof TournamentModel,
    'MeleeTournamentModel is subclass of TournamentModel'
  ).toBeTruthy()

  const tournament = melee(3)
  expect(tournament.run(), 'three players cannot fill two doublettes').toBeFalsy()

  const eight = melee(8)
  expect(eight.run(), 'eight players make two matches').toBeTruthy()
  const matches = eight.getMatches()
  expect(matches.length, 'two matches').toBe(2)

  // every player is drawn exactly once, in a doublette
  const drawn = []
  matches.forEach(function (match) {
    match.teams.forEach(function (lineupid) {
      const lineup = eight.getLineup(lineupid)
      expect(lineup.length, 'doublette').toBe(2)
      drawn.push(...lineup)
    })
  })
  expect(drawn.sort(function (a, b) { return a - b }),
    'every player plays exactly once').toEqual([0, 1, 2, 3, 4, 5, 6, 7])
})

test('MeleeTournamentModel: the ranking counts players, not line-ups', () => {
  const tournament = melee(8)
  tournament.run()
  const matches = tournament.getMatches()
  const winners = []
  const losers = []
  while (matches.length) {
    const match = matches.get(0)
    winners.push(...tournament.getLineup(match.getTeamID(0)))
    losers.push(...tournament.getLineup(match.getTeamID(1)))
    match.finish([13, 7])
  }
  expect(tournament.getState().get(), 'idle after the round').toBe('idle')

  const ranking = tournament.ranking.get()
  expect(ranking.wins.length, 'one ranking entry per player').toBe(8)
  winners.forEach(function (playerid) {
    expect(ranking.wins[playerid], 'every winner gets the win').toBe(1)
    expect(ranking.points[playerid], 'every winner gets the points').toBe(13)
    expect(ranking.saldo[playerid], 'every winner gets the saldo').toBe(6)
  })
  losers.forEach(function (playerid) {
    expect(ranking.wins[playerid], 'losers stay at zero wins').toBe(0)
    expect(ranking.saldo[playerid], 'losers get the negative saldo').toBe(-6)
  })

  // the ranking survives a recalculation from the history
  expect(tournament.verifyRanking(), 'ranking matches its history').toBe(true)
})

test('MeleeTournamentModel: leftover players sit out and are compensated', () => {
  const tournament = melee(9)
  tournament.run()
  // votes are handed out with global team ids, like everywhere else
  const byes = tournament.getVotes('bye').asArray()
  expect(byes.length, 'one player sits out').toBe(1)
  const benched = tournament.teams.asArray().indexOf(byes[0])

  const matches = tournament.getMatches()
  while (matches.length) {
    matches.get(0).finish([13, 7])
  }
  const ranking = tournament.ranking.get()
  expect(ranking.wins[benched], 'a bye counts as a win').toBe(1)

  // the next round sends somebody else to the bench
  expect(tournament.run(), 'second round').toBeTruthy()
  const secondbyes = tournament.getVotes('bye').asArray()
  expect(secondbyes, 'the bye rotates').not.toEqual(byes)
})

test('MeleeTournamentModel: survives save and restore', () => {
  const tournament = melee(8)
  tournament.run()
  const matches = tournament.getMatches()
  matches.get(0).finish([13, 7])

  const data = tournament.save()
  const restored = new MeleeTournamentModel()
  expect(restored.restore(data), 'restore succeeds').toBe(true)
  expect(restored.save(), 'round trip is lossless').toEqual(data)
  expect(restored.getLineup(0), 'line-ups survive').toEqual(tournament.getLineup(0))
  expect(restored.verifyRanking(), 'the restored ranking matches its history').toBe(true)

  // and it keeps playing
  const open = restored.getMatches()
  open.get(0).finish([13, 2])
  expect(restored.getState().get(), 'idle after the last match').toBe('idle')
  expect(restored.run(), 'the next round can be drawn').toBeTruthy()
})
