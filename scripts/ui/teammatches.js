/**
 * Every match a team (or, in a Supermêlée, a player) took part in,
 * across all tournaments of the state.
 *
 * Which side a team is on cannot be answered by comparing ids: a
 * Supermêlée match is played by a line-up drawn for that round, not
 * by a registered team. The players decide instead — a side belongs
 * to this team if it is the team, or if it contains one of its
 * players. Both are the same question for a normal tournament, where
 * the side *is* the registered team.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * @param side a TeamModel, as the tournament's display list hands it out
 * @param team the team in question
 * @return true if this side is (or contains) the team
 */
function isOwnSide (side, team) {
  if (!side || !team) {
    return false
  }
  if (side === team) {
    return true
  }
  return team.players.some(function (player) {
    return side.players.indexOf(player) !== -1
  })
}

/**
 * @param side a TeamModel
 * @param exclude players to leave out (the team's own)
 * @return the names of the side's players
 */
function names (side, exclude) {
  if (!side) {
    return []
  }
  return side.players.filter(function (player) {
    return !exclude || exclude.indexOf(player) === -1
  }).map(function (player) {
    return player.getName()
  }).filter(function (name) {
    return !!name
  })
}

function outcomeOf (score) {
  if (!score) {
    return 'open'
  }
  if (score[0] > score[1]) {
    return 'won'
  }
  if (score[0] < score[1]) {
    return 'lost'
  }
  return 'draw'
}

/**
 * @param tournaments
 *          a ListModel of TournamentModels (State.tournaments)
 * @param team
 *          the TeamModel to report on
 * @param teamlist
 *          the global team list (State.teams)
 * @return an array of rows: tournament, round, place, partners,
 *         opponents, score (from this team's side) and outcome
 */
export default function collectMatches (tournaments, team, teamlist) {
  const rows = []
  if (!team) {
    return rows
  }
  tournaments.forEach(function (tournament) {
    const sides = tournament.getDisplayTeams(teamlist)
    tournament.getCombinedHistory().forEach(function (match) {
      const own = match.teams.findIndex(function (id) {
        return isOwnSide(sides.get(id), team)
      })
      if (own === -1) {
        return
      }
      const other = match.teams.length === 2 ? 1 - own : undefined
      const isBye = match.isBye && match.isBye()
      const score = match.score
        ? [match.score[own], match.score[1 - own]]
        : undefined
      rows.push({
        tournament: tournament.getName().get(),
        round: match.getGroup() + 1,
        place: match.place || '',
        partners: names(sides.get(match.teams[own]), team.players),
        opponents: isBye || other === undefined
          ? []
          : names(sides.get(match.teams[other])),
        score: isBye ? undefined : score,
        outcome: isBye ? 'bye' : outcomeOf(score)
      })
    })
  })
  return rows
}
