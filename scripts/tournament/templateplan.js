/**
 * Turns a template step into concrete phase specifications.
 *
 * Everything in here is pure: it reads the teams and the tournaments
 * which have already been played and returns plain objects. Creating
 * the tournaments themselves is the controller's job.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * @param tournament
 *          a TournamentModel
 * @return its teams as global team ids, best first
 */
export function rankedTeams (tournament) {
  const ranking = tournament.getRanking().get()
  return ranking.displayOrder.map(function (internalID) {
    return ranking.ids[internalID]
  })
}

/**
 * distribute the teams over a number of groups, snake-wise: the first
 * team goes to the first group, the second to the second, and the
 * direction turns around at the end of every pass. That way the groups
 * are of roughly equal strength.
 *
 * @param teamIDs
 *          global team ids, best first
 * @param count
 *          the number of groups
 * @return an array of arrays of global team ids
 */
export function snakeGroups (teamIDs, count) {
  const groups = []
  while (groups.length < count) {
    groups.push([])
  }
  teamIDs.forEach(function (teamID, index) {
    const pass = Math.floor(index / count)
    let position = index % count
    if (pass % 2 === 1) {
      position = count - position - 1
    }
    groups[position].push(teamID)
  })
  return groups
}

/**
 * take one team from every list in turn, until all lists are empty
 *
 * @param lists
 *          an array of arrays
 * @return a single array
 */
function interleave (lists) {
  const result = []
  const rest = lists.map(function (list) {
    return list.slice(0)
  })
  while (rest.some(function (list) { return list.length > 0 })) {
    rest.forEach(function (list) {
      if (list.length > 0) {
        result.push(list.shift())
      }
    })
  }
  return result
}

/**
 * @param tournaments
 *          an array of TournamentModels
 * @return every global team id playing in them
 */
function teamsOf (tournaments) {
  const teamIDs = []
  tournaments.forEach(function (tournament) {
    rankedTeams(tournament).forEach(function (teamID) {
      teamIDs.push(teamID)
    })
  })
  return teamIDs
}

/**
 * @param template
 *          a template
 * @param stepIndex
 *          the step to look back from
 * @return the tournaments of the last preceding group step, or []
 */
function groupTournaments (template, stepIndex, context) {
  for (let index = stepIndex - 1; index >= 0; index -= 1) {
    if (template.steps[index].kind === 'groups') {
      return context.tournaments[index] || []
    }
  }
  return []
}

/**
 * @return true when every phase of the previous step has been played
 */
export function stepReady (template, stepIndex, context) {
  if (stepIndex <= 0) {
    return true
  }
  const previous = context.tournaments[stepIndex - 1] || []
  if (previous.length === 0) {
    return false
  }
  return previous.every(function (tournament) {
    return tournament.getState().get() === 'finished'
  })
}

/**
 * @param template
 *          a template
 * @param stepIndex
 *          which of its steps to plan
 * @param context
 *          {teamIDs: all registered teams, in global ranking order;
 *          tournaments: the tournaments created for each earlier step}
 * @return an array of {system, name, teamIDs, startIndex}
 */
export function planStep (template, stepIndex, context) {
  const step = template.steps[stepIndex]
  const teamIDs = context.teamIDs || []

  switch (step.kind) {
    case 'groups': {
      let startIndex = 0
      return snakeGroups(teamIDs, step.groups).map(function (ids, index) {
        const spec = {
          system: step.system,
          name: (step.names && step.names[index]) || step.name,
          teamIDs: ids,
          startIndex
        }
        startIndex += ids.length
        return spec
      })
    }

    case 'top': {
      const groups = groupTournaments(template, stepIndex, context)
      const qualified = interleave(groups.map(function (tournament) {
        return rankedTeams(tournament).slice(0, step.perGroup)
      }))
      return [{
        system: step.system,
        name: step.name,
        teamIDs: qualified,
        startIndex: 0
      }]
    }

    case 'brackets': {
      const groups = groupTournaments(template, stepIndex, context)
      const ranked = interleave(groups.map(rankedTeams))
      const blocks = []
      for (let index = 0; index < ranked.length; index += step.size) {
        blocks.push(ranked.slice(index, index + step.size))
      }
      // a single team cannot play a bracket of its own
      if (blocks.length > 1 && blocks[blocks.length - 1].length < 2) {
        const lonely = blocks.pop()
        blocks[blocks.length - 1] = blocks[blocks.length - 1].concat(lonely)
      }
      let bracketIndex = 0
      return blocks.map(function (ids) {
        const spec = {
          system: step.system,
          name: String.fromCharCode('A'.charCodeAt(0) + bracketIndex) + '-Turnier',
          teamIDs: ids,
          startIndex: bracketIndex * step.size
        }
        bracketIndex += 1
        return spec
      })
    }

    case 'rest': {
      const groups = groupTournaments(template, stepIndex, context)
      const taken = teamsOf(context.tournaments[stepIndex - 1] || [])
      const isTaken = function (teamID) {
        return taken.indexOf(teamID) !== -1
      }
      const lists = groups.map(function (tournament) {
        return rankedTeams(tournament).filter(function (teamID) {
          return !isTaken(teamID)
        })
      })
      const played = teamsOf(groups)
      const latecomers = teamIDs.filter(function (teamID) {
        return !isTaken(teamID) && played.indexOf(teamID) === -1
      })
      return [{
        system: step.system,
        name: step.name,
        teamIDs: interleave(lists).concat(latecomers),
        startIndex: taken.length
      }]
    }

    default:
      console.error('unknown template step: ' + step.kind)
      return []
  }
}
