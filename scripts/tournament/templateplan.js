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

import { withDefaults } from './templates.js'

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
 * @param groupCount
 *          how many group phases feed the final
 * @param options
 *          the plan options
 * @return how many teams of every group play the final
 */
export function qualifiersPerGroup (groupCount, options) {
  return Math.max(1, Math.floor(withDefaults(options).kosize /
    Math.max(1, groupCount)))
}

/**
 * @param size
 *          the number of teams in a KO tournament
 * @return the rounds it takes to play it
 */
function koRounds (size) {
  return size >= 2 ? Math.ceil(Math.log2(size)) : 0
}

/**
 * @param template
 *          a template
 * @param options
 *          the plan options
 * @return the rounds the whole tournament takes, the most matches a
 *         single team can play in it, one line per phase, and both
 *         summary lines for the box to show
 */
/**
 * @param step
 *          a template step
 * @param options
 *          the plan options
 * @return how many rounds that step is played over
 */
export function stepRounds (step, options) {
  const complete = withDefaults(options)
  switch (step.kind) {
    case 'groups':
      return complete.rounds
    case 'rest':
      // the placement round is a single round for everybody who did
      // not make the KO phase
      return 1
    case 'top':
    case 'brackets':
      return koRounds(complete.kosize)
    default:
      return 0
  }
}

/**
 * @param count
 *          a number of rounds
 * @param one
 *          how to say it for a single round
 * @param many
 *          how to say it for more than one
 */
function rounds (count, one, many) {
  return count === 1 ? one : count + ' ' + many
}

export function schedule (template, options) {
  const complete = withDefaults(options)
  const ko = koRounds(complete.kosize)
  const lines = []
  let total = 0
  let matches = 0
  let alternative = 0
  template.steps.forEach(function (step) {
    switch (step.kind) {
      case 'groups':
        lines.push(rounds(complete.rounds, 'eine Vorrunde', 'Vorrunden'))
        total += complete.rounds
        matches += complete.rounds
        alternative = 0
        break
      case 'top':
        lines.push('bis zu ' + rounds(ko, 'einer Runde', 'Runden') +
          ' im Finale')
        total += ko
        matches += ko
        alternative = ko
        break
      case 'brackets':
        lines.push('bis zu ' + rounds(ko, 'einer KO-Runde', 'KO-Runden'))
        total += ko
        matches += ko
        alternative = ko
        break
      case 'rest': {
        const placement = stepRounds(step, complete)
        lines.push(rounds(placement, 'eine Runde', 'Runden') +
          ' in der Platzierungsrunde')
        total += placement
        // a team plays either the final or the placement round
        matches += Math.max(0, placement - alternative)
        alternative = 0
        break
      }
    }
  })
  return {
    rounds: total,
    matches,
    lines,
    total: total + ' Runden insgesamt',
    // only worth saying where the phases do not add up for a single
    // team: it plays either the final or the placement round
    note: matches === total
      ? ''
      : 'höchstens ' + matches + ' Begegnungen pro Team'
  }
}

/**
 * @param template
 *          a template
 * @param options
 *          the plan options
 * @return the smallest field this template makes sense for
 */
export function minTeams (template, options) {
  const complete = withDefaults(options)
  let min = 2
  const hasRest = template.steps.some(function (step) {
    return step.kind === 'rest'
  })
  template.steps.forEach(function (step) {
    if (step.kind === 'groups') {
      min = Math.max(min, step.groups * 2)
    }
    if (step.kind === 'top') {
      // somebody has to be left over for the placement round
      min = Math.max(min, complete.kosize + (hasRest ? 2 : 0))
    }
  })
  return min
}

/**
 * @param template
 *          a template
 * @param stepIndex
 *          one of its steps
 * @param options
 *          the plan options
 * @param groupCount
 *          how many group phases the step before it had
 * @return the step's label, with the configured numbers in it
 */
export function stepLabel (template, stepIndex, options, groupCount) {
  const step = template.steps[stepIndex]
  const complete = withDefaults(options)
  switch (step.kind) {
    case 'top':
      return 'Finale der besten ' +
        qualifiersPerGroup(groupCount || 1, complete) +
        (groupCount > 1 ? ' jeder Gruppe' : '')
    case 'brackets':
      return 'KO-Turniere A, B, C … mit je ' + complete.kosize + ' Teams'
    default:
      return step.label
  }
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
 *          a step which is supposed to cover the whole field
 * @param context
 *          as for planStep()
 * @return the teams this step leaves without a phase
 */
export function unplacedTeams (template, stepIndex, context) {
  if (template.steps[stepIndex].kind !== 'brackets') {
    return []
  }
  const pool = interleave(
    groupTournaments(template, stepIndex, context).map(rankedTeams))
  const placed = []
  planStep(template, stepIndex, context).forEach(function (spec) {
    spec.teamIDs.forEach(function (teamID) {
      placed.push(teamID)
    })
  })
  return pool.filter(function (teamID) {
    return placed.indexOf(teamID) === -1
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
  const options = withDefaults(context.options)

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
      const perGroup = qualifiersPerGroup(groups.length, options)
      const qualified = interleave(groups.map(function (tournament) {
        return rankedTeams(tournament).slice(0, perGroup)
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
      for (let index = 0; index < ranked.length; index += options.kosize) {
        blocks.push(ranked.slice(index, index + options.kosize))
      }
      // a single team cannot play a bracket of its own -- and it must
      // not be stuffed into the bracket above it either, which would
      // turn a clean field of eight into nine. It hangs over instead.
      if (blocks.length > 1 && blocks[blocks.length - 1].length < 2) {
        blocks.pop()
      }
      let bracketIndex = 0
      return blocks.map(function (ids) {
        const spec = {
          system: step.system,
          name: String.fromCharCode('A'.charCodeAt(0) + bracketIndex) + '-Turnier',
          teamIDs: ids,
          startIndex: bracketIndex * options.kosize
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
