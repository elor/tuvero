/**
 * Starts the next phase (or phases) of a template plan.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import TournamentIndex from './tournamentindex.js'
import Presets from 'presets'
import { planStep, stepReady } from './templateplan.js'

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
  if (stepIndex === 0 && teamIDs.length < (template.minteams || 2)) {
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
