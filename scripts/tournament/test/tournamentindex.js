/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import TournamentIndex from '../tournamentindex.js'
test('TournamentIndex', () => {
  expect(TournamentIndex.createTournament(), 'empty construction fails').toBe(undefined)
  expect(TournamentIndex.createTournament('undefined'), 'undefined fails').toBe(undefined)
  expect(TournamentIndex.createTournament('round'), 'round').toBeTruthy()
  expect(TournamentIndex.createTournament('swiss'), 'swiss').toBeTruthy()
  expect(TournamentIndex.createTournament('ko'), 'ko').toBeTruthy()
  expect(TournamentIndex.createTournament('poule'), 'poule fails').toBe(undefined)
  expect(
    TournamentIndex.createTournament({}),
    'savedata-passing without "sys" property fails'
  ).toBe(undefined)
  expect(TournamentIndex.createTournament({
    sys: 'round'
  }), 'round-tournament with savedata').toBeTruthy()
  expect(TournamentIndex.createTournament({
    sys: 'poule'
  }), 'poule-tournament with savedata fails').toBe(undefined)
})
