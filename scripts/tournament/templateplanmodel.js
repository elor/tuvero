/**
 * TemplatePlanModel: which template a tournament follows, and how far
 * it has got. The phases themselves are ordinary tournaments; the plan
 * only remembers which of them belongs to which step.
 *
 * @return TemplatePlanModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Model from '../core/model.js'
import { templateById, withDefaults } from './templates.js'

class TemplatePlanModel extends Model {
  constructor () {
    super()
    this.id = undefined
    // steps[stepIndex] = the tournament ids created for that step
    this.steps = []
    // how many qualifying rounds, how big the KO tournaments are
    this.options = withDefaults({})
  }

  /**
   * change one of the options. Only possible as long as no phase has
   * been drawn -- afterwards the numbers are part of what is played.
   *
   * @return true when the value was taken
   */
  setOption (name, value) {
    if (this.steps.length > 0 || this.options[name] === undefined) {
      return false
    }
    this.options[name] = value
    this.emit('update')
    return true
  }

  /**
   * @return true while the options can still be changed
   */
  isConfigurable () {
    return this.steps.length === 0
  }

  /**
   * @return the template being followed, or undefined
   */
  getTemplate () {
    return templateById(this.id)
  }

  isActive () {
    return this.getTemplate() !== undefined
  }

  isFinished () {
    return this.isActive() && this.nextStep() === -1
  }

  /**
   * start following a template from its first step
   *
   * @param id
   *          a template id
   * @return true on success, false otherwise
   */
  start (id) {
    if (templateById(id) === undefined) {
      return false
    }
    this.id = id
    this.steps = []
    this.options = withDefaults({})
    this.emit('update')
    return true
  }

  /**
   * remember which tournaments were created for a step. An empty
   * list marks a step which had nothing to do -- it counts as done.
   *
   * @param stepIndex
   *          the step
   * @param tournamentIDs
   *          the ids of its phases
   */
  record (stepIndex, tournamentIDs) {
    while (this.steps.length < stepIndex) {
      this.steps.push([])
    }
    this.steps[stepIndex] = tournamentIDs.slice(0)
    this.emit('update')
  }

  /**
   * @return the index of the next step to start, or -1 when there is none
   */
  nextStep () {
    const template = this.getTemplate()
    if (!template) {
      return -1
    }
    for (let index = 0; index < template.steps.length; index += 1) {
      if (this.steps[index] === undefined) {
        return index
      }
    }
    return -1
  }

  /**
   * @param tournaments
   *          the tournament list to look the ids up in
   * @return an array of arrays of TournamentModels, one per started step
   */
  tournamentsByStep (tournaments) {
    return this.steps.map(function (ids) {
      return (ids || []).map(function (id) {
        return tournaments.get(id)
      }).filter(function (tournament) {
        return tournament !== undefined
      })
    })
  }

  clear () {
    this.id = undefined
    this.steps = []
    this.options = withDefaults({})
    this.emit('update')
  }

  save () {
    const data = super.save()
    data.id = this.id
    data.steps = this.steps
    data.options = this.options
    return data
  }

  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.id = data.id
    this.steps = (data.steps || []).map(function (ids) {
      return ids.slice(0)
    })
    this.options = withDefaults(data.options)
    this.emit('update')
    return true
  }
}

TemplatePlanModel.prototype.EVENTS = {
  update: true
}

TemplatePlanModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT)
TemplatePlanModel.prototype.SAVEFORMAT.id = String
TemplatePlanModel.prototype.SAVEFORMAT.steps = [[Number]]
TemplatePlanModel.prototype.SAVEFORMAT.options = Object

export default TemplatePlanModel
