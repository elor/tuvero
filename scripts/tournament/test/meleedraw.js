/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import { drawRound } from '../meleedraw.js'

/**
 * deterministic stand-in for Random: always takes the first element,
 * so a draw can be asserted exactly
 */
const firstRng = {
  pickAndRemove: function (array) {
    return array.shift()
  }
}

function noHistory () {
  return {
    partners: function () { return 0 },
    opponents: function () { return 0 },
    byes: function () { return 0 }
  }
}

function playerIDs (count) {
  return Array.from({ length: count }, function (ignored, index) {
    return index
  })
}

test('drawRound: everybody plays when the count fits', () => {
  const draw = drawRound(playerIDs(8), noHistory(), { teamsize: 2, rng: firstRng })

  expect(draw.byes, 'nobody sits out').toEqual([])
  expect(draw.lineups.length, 'four doublettes').toBe(4)
  expect(draw.matches.length, 'two matches').toBe(2)
  draw.lineups.forEach(function (lineup) {
    expect(lineup.length, 'doublette').toBe(2)
  })
  const drawn = draw.lineups.flat().sort(function (a, b) { return a - b })
  expect(drawn, 'every player is drawn exactly once').toEqual(playerIDs(8))
})

test('drawRound: leftover players sit out', () => {
  const draw = drawRound(playerIDs(9), noHistory(), { teamsize: 2, rng: firstRng })

  expect(draw.byes.length, 'one player sits out').toBe(1)
  expect(draw.matches.length, 'two matches').toBe(2)
  expect(draw.lineups.flat().length, 'eight players drawn').toBe(8)
})

test('drawRound: triplettes', () => {
  const draw = drawRound(playerIDs(13), noHistory(), { teamsize: 3, rng: firstRng })

  expect(draw.lineups.length, 'four triplettes').toBe(4)
  expect(draw.matches.length, 'two matches').toBe(2)
  expect(draw.byes.length, 'one player sits out').toBe(1)
})

test('drawRound: too few players for a single match', () => {
  const draw = drawRound(playerIDs(3), noHistory(), { teamsize: 2, rng: firstRng })

  expect(draw.matches, 'no match can be drawn').toEqual([])
  expect(draw.lineups, 'no line-up can be drawn').toEqual([])
  expect(draw.byes.length, 'everybody sits out').toBe(3)
})

test('drawRound: the bye rotates', () => {
  const history = noHistory()
  // player 0 already sat out once
  history.byes = function (playerid) {
    return playerid === 0 ? 1 : 0
  }

  const draw = drawRound(playerIDs(5), history, { teamsize: 2, rng: firstRng })

  expect(draw.byes, 'a player who has not sat out yet').not.toContain(0)
})

test('drawRound: avoids repeating partners', () => {
  const history = noHistory()
  // 0 and 1 have played together before
  history.partners = function (a, b) {
    return (a === 0 && b === 1) || (a === 1 && b === 0) ? 1 : 0
  }

  const draw = drawRound(playerIDs(4), history, { teamsize: 2, rng: firstRng })

  const together = draw.lineups.some(function (lineup) {
    return lineup.includes(0) && lineup.includes(1)
  })
  expect(together, '0 and 1 get new partners').toBe(false)
})

test('drawRound: avoids repeating opponents', () => {
  const history = noHistory()
  // in a four-player doublette round the partners decide the match,
  // so make 0+1 partners and let 0 have faced 2 already
  history.opponents = function (a, b) {
    return (a === 0 && b === 2) || (a === 2 && b === 0) ? 1 : 0
  }
  history.partners = function (a, b) {
    return (a === 0 && b === 2) || (a === 2 && b === 0) ? 1 : 0
  }

  const draw = drawRound(playerIDs(6), history, { teamsize: 3, rng: firstRng })

  const sameTeam = draw.lineups.some(function (lineup) {
    return lineup.includes(0) && lineup.includes(2)
  })
  expect(sameTeam, '0 and 2 avoid each other where possible').toBe(false)
})
