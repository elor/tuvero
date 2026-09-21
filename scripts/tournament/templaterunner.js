/**
 * Starts the next phase (or phases) of a template plan.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import TournamentIndex from './tournamentindex.js'
import Presets from 'presets'
import { planStep, stepReady, unplacedTeams, minTeams, stepRounds } from './templateplan.js'

/**
 * @param plan
 *          a TemplatePlanModel
 * @param teamIDs
 *          all registered teams, in global ranking order
 * @param tournaments
 *          the TournamentListModel of the state
 * @return the context planStep() and stepReady() expect
 */
function context (plan, teamIDs, tournaments) {
  return {
    teamIDs,
    options: plan.options,
    tournaments: plan.tournamentsByStep(tournaments)
  }
}

/**
 * @return true if the next step of the plan can be started right now
 */
export function canStartNextStep (plan, teamIDs, tournaments) {
  const template = plan.getTemplate()
  const stepIndex = plan.nextStep()
  if (!template || stepIndex === -1) {
    return false
  }
  // the minimum only gates the start: once the phases are running,
  // a deleted team must not block the rest of the plan
  if (stepIndex === 0 && teamIDs.length < minTeams(template, plan.options)) {
    return false
  }
  return stepReady(template, stepIndex, context(plan, teamIDs, tournaments))
}

/**
 * create the tournaments of a single phase specification
 *
 * @param spec
 *          {system, name, teamIDs, startIndex}
 * @param tournaments
 *          the TournamentListModel to add it to
 * @return the new tournament
 */
function createPhase (spec, tournaments) {
  let rankingorder = ['wins']
  if (Presets.systems[spec.system] && Presets.systems[spec.system].ranking) {
    rankingorder = Presets.systems[spec.system].ranking.slice(0)
  }
  const tournament = TournamentIndex.createTournament(spec.system, rankingorder)
  tournament.getName().set(spec.name)
  spec.teamIDs.forEach(function (teamID) {
    tournament.addTeam(teamID)
  })
  tournaments.push(tournament, spec.startIndex)
  return tournament
}

/**
 * start the next step of a plan: create its phases and remember them
 *
 * @return true when the phases were created, false otherwise
 */
export function startNextStep (plan, teamIDs, tournaments) {
  if (!canStartNextStep(plan, teamIDs, tournaments)) {
    return false
  }
  const stepIndex = plan.nextStep()
  const specs = planStep(plan.getTemplate(), stepIndex,
    context(plan, teamIDs, tournaments))
  const created = specs.filter(function (spec) {
    return spec.teamIDs.length >= 2
  }).map(function (spec) {
    return createPhase(spec, tournaments).getID()
  })
  // a step which has nothing to play -- a placement round without
  // any teams left over -- still counts as done, or the plan would
  // never reach its end
  plan.record(stepIndex, created)
  return true
}

/**
 * @return the specifications the next step would create, for a preview
 */
export function previewNextStep (plan, teamIDs, tournaments) {
  const stepIndex = plan.nextStep()
  if (stepIndex === -1) {
    return []
  }
  return planStep(plan.getTemplate(), stepIndex,
    context(plan, teamIDs, tournaments))
}

/**
 * @return the teams the next step would leave without a phase
 */
export function previewUnplaced (plan, teamIDs, tournaments) {
  const stepIndex = plan.nextStep()
  if (stepIndex === -1) {
    return []
  }
  return unplacedTeams(plan.getTemplate(), stepIndex,
    context(plan, teamIDs, tournaments))
}

/**
 * the phases which are waiting to be drawn or to play another round.
 * A qualifying phase stops once it has played the rounds the plan
 * asks for -- that is what makes the setting real.
 *
 * @param plan
 *          a TemplatePlanModel
 * @param tournaments
 *          the TournamentListModel of the state
 * @return an array of TournamentModels
 */
function pendingTournaments (plan, tournaments) {
  const template = plan.getTemplate()
  if (!template) {
    return []
  }
  const pending = []
  plan.tournamentsByStep(tournaments).forEach(function (phases, stepIndex) {
    const step = template.steps[stepIndex]
    // a KO tournament ends by itself; the ones played over rounds
    // stop when the plan says they are done
    const limit = step.kind === 'groups' || step.kind === 'rest'
      ? stepRounds(step, plan.options)
      : undefined
    phases.forEach(function (tournament) {
      const state = tournament.getState().get()
      if (state !== 'initial' && state !== 'idle') {
        return
      }
      if (limit !== undefined && tournament.getRound &&
        tournament.getRound() + 1 >= limit) {
        return
      }
      pending.push(tournament)
    })
  })
  return pending
}

/**
 * @return true when a phase of the plan is waiting to be drawn or
 *         to play its next round
 */
export function canStartRound (plan, tournaments) {
  return pendingTournaments(plan, tournaments).length > 0
}

/**
 * start the pending round in every phase of the plan at once
 *
 * @return the number of phases which were started
 */
export function startPendingRounds (plan, tournaments) {
  let started = 0
  pendingTournaments(plan, tournaments).forEach(function (tournament) {
    if (tournament.run()) {
      started += 1
    }
  })
  return started
}

/**
 * @return true when the next step can be started right away, ending
 *         the phases before it if they are only waiting for it
 */
export function canAdvance (plan, teamIDs, tournaments) {
  const stepIndex = plan.nextStep()
  if (stepIndex === -1 || !plan.getTemplate()) {
    return false
  }
  if (canStartNextStep(plan, teamIDs, tournaments)) {
    return true
  }
  const previous = plan.tournamentsByStep(tournaments)[stepIndex - 1] || []
  if (previous.length === 0) {
    return false
  }
  // every result is in, the phases are just waiting to be closed
  return previous.every(function (tournament) {
    const state = tournament.getState().get()
    return state === 'idle' || state === 'finished'
  })
}

/**
 * end the phases of the current step, draw the next one and start it
 *
 * @return true when the next step is running, false otherwise
 */
export function advanceToNextStep (plan, teamIDs, tournaments) {
  if (!canAdvance(plan, teamIDs, tournaments)) {
    return false
  }
  const stepIndex = plan.nextStep()
  const previous = plan.tournamentsByStep(tournaments)[stepIndex - 1] || []
  const closed = tournaments.areTournamentsClosed()
  previous.forEach(function (tournament) {
    if (tournament.getState().get() !== 'finished') {
      tournament.finish()
    }
    // the organiser may have ended a phase by hand already
    if (!closed[tournament.getID()]) {
      tournaments.closeTournament(tournament.getID())
    }
  })
  if (!startNextStep(plan, teamIDs, tournaments)) {
    return false
  }
  plan.tournamentsByStep(tournaments)[stepIndex].forEach(function (tournament) {
    tournament.run()
  })
  return true
}
