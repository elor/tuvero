/**
 * The draw of a Supermêlée round: who plays with whom, against whom,
 * and who sits out.
 *
 * Kept free of models on purpose — it takes plain player ids and
 * three history accessors and returns plain arrays, so it can be
 * tested exhaustively without building a tournament.
 *
 * The draw is randomised, but not blindly: it tries a number of
 * random compositions and keeps the one that repeats the fewest
 * partners and opponents. Perfect avoidance is impossible in a small
 * field — after enough rounds everybody has played with everybody —
 * so this is a cost minimisation, not a constraint solver.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Random from '../core/random.js'

const defaultRng = new Random()

/**
 * A repeated partner is worse than a repeated opponent: you spend
 * the whole match with your partner, and the point of a mêlée is to
 * meet new people.
 */
const PARTNERCOST = 3
const OPPONENTCOST = 1
const ATTEMPTS = 32

/**
 * @param array
 *          an array. Not modified.
 * @param rng
 *          a Random instance
 * @return a new array with the same elements in random order
 */
function shuffle (array, rng) {
  const rest = array.slice(0)
  const shuffled = []
  while (rest.length) {
    shuffled.push(rng.pickAndRemove(rest))
  }
  return shuffled
}

/**
 * @param team
 *          an array of player ids
 * @param candidate
 *          a player id
 * @param history
 *          the history accessors
 * @return how often the candidate has played with this team before
 */
function partnerCost (team, candidate, history) {
  return team.reduce(function (sum, playerid) {
    return sum + history.partners(playerid, candidate)
  }, 0)
}

/**
 * @param a
 *          an array of player ids
 * @param b
 *          an array of player ids
 * @param history
 *          the history accessors
 * @return how often these two line-ups have faced each other before
 */
function opponentCost (a, b, history) {
  return a.reduce(function (sum, playerid) {
    return sum + b.reduce(function (inner, opponentid) {
      return inner + history.opponents(playerid, opponentid)
    }, 0)
  }, 0)
}

/**
 * pick the entry of `pool` with the lowest cost, remove it from the
 * pool and return it. Ties go to the first entry, which is fine
 * because the pool is shuffled.
 *
 * @param pool
 *          an array of player ids. Modified.
 * @param cost
 *          a function(playerid) -> number
 * @return the chosen player id
 */
function takeCheapest (pool, cost) {
  let best = 0
  let bestcost = cost(pool[0])
  pool.forEach(function (playerid, index) {
    const current = cost(playerid)
    if (current < bestcost) {
      best = index
      bestcost = current
    }
  })
  return pool.splice(best, 1)[0]
}

/**
 * compose line-ups from a shuffled pool, greedily avoiding repeated
 * partners
 *
 * @param pool
 *          an array of player ids. Modified.
 * @param teamsize
 *          the number of players per line-up
 * @param history
 *          the history accessors
 * @return an array of line-ups (arrays of player ids)
 */
function composeLineups (pool, teamsize, history) {
  const lineups = []
  while (pool.length >= teamsize) {
    const team = [pool.shift()]
    while (team.length < teamsize) {
      team.push(takeCheapest(pool, function (candidate) {
        return partnerCost(team, candidate, history)
      }))
    }
    lineups.push(team)
  }
  return lineups
}

/**
 * pair the line-ups, greedily avoiding repeated opponents
 *
 * @param lineups
 *          an array of line-ups
 * @param history
 *          the history accessors
 * @return an array of [lineupIndex, lineupIndex] pairs
 */
function pairLineups (lineups, history) {
  const open = lineups.map(function (ignored, index) {
    return index
  })
  const matches = []
  while (open.length >= 2) {
    const home = open.shift()
    let best = 0
    let bestcost = opponentCost(lineups[home], lineups[open[0]], history)
    open.forEach(function (candidate, index) {
      const current = opponentCost(lineups[home], lineups[candidate], history)
      if (current < bestcost) {
        best = index
        bestcost = current
      }
    })
    matches.push([home, open.splice(best, 1)[0]])
  }
  return matches
}

/**
 * @param lineups
 *          an array of line-ups
 * @param matches
 *          an array of index pairs
 * @param history
 *          the history accessors
 * @return the total cost of this composition. Lower is better.
 */
function totalCost (lineups, matches, history) {
  const partners = lineups.reduce(function (sum, lineup) {
    return sum + lineup.reduce(function (inner, playerid, index) {
      return inner + partnerCost(lineup.slice(0, index), playerid, history)
    }, 0)
  }, 0)
  const opponents = matches.reduce(function (sum, match) {
    return sum + opponentCost(lineups[match[0]], lineups[match[1]], history)
  }, 0)
  return partners * PARTNERCOST + opponents * OPPONENTCOST
}

/**
 * Draw one Supermêlée round.
 *
 * Only complete, equally sized line-ups are drawn: a match is always
 * doublette vs doublette (or triplette vs triplette), so every
 * player of a round plays exactly one game. Whoever is left over
 * sits this round out, starting with the players who have sat out
 * least often.
 *
 * @param players
 *          an array of player ids
 * @param history
 *          an object of three accessors: partners(a, b), opponents(a,
 *          b) and byes(playerid), each returning how often that has
 *          happened so far
 * @param options
 *          optional: teamsize (default 2), rng (a Random instance),
 *          attempts (how many compositions to try)
 * @return an object with `lineups` (arrays of player ids), `matches`
 *         (pairs of line-up indices) and `byes` (player ids)
 */
export function drawRound (players, history, options) {
  options = options || {}
  const teamsize = options.teamsize || 2
  const rng = options.rng || defaultRng
  const attempts = options.attempts || ATTEMPTS

  const matchcount = Math.floor(players.length / (2 * teamsize))
  const playercount = matchcount * 2 * teamsize

  /*
   * Sitting out is a cost, so it goes to whoever has carried it
   * least often. Shuffling first keeps the choice random among
   * everyone with the same bye count.
   */
  const ordered = shuffle(players, rng).sort(function (a, b) {
    return history.byes(a) - history.byes(b)
  })
  const byes = ordered.slice(0, players.length - playercount)
  const playing = ordered.slice(players.length - playercount)

  let best
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const lineups = composeLineups(shuffle(playing, rng), teamsize, history)
    const matches = pairLineups(lineups, history)
    const cost = totalCost(lineups, matches, history)
    if (best === undefined || cost < best.cost) {
      best = { lineups, matches, cost }
    }
    if (cost === 0) {
      break
    }
  }

  return {
    lineups: best ? best.lineups : [],
    matches: best ? best.matches : [],
    byes
  }
}

export default drawRound
