/**
 * TemplatePlanView: pick a tournament template and start its phases
 * one after the other.
 *
 * @return TemplatePlanView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import Listener from '../core/listener.js'
import State from './state.js'
import TEMPLATES, { OPTIONS } from '../tournament/templates.js'
import { canAdvance, advanceToNextStep, canStartRound, startPendingRounds, previewNextStep, previewUnplaced } from '../tournament/templaterunner.js'
import { schedule, minTeams, stepLabel } from '../tournament/templateplan.js'
import Strings from './strings.js'
import Presets from 'presets'

/**
 * @return the templates this variant can actually play
 */
function availableTemplates () {
  return TEMPLATES.filter(function (template) {
    return template.steps.every(function (step) {
      return !!Presets.systems[step.system]
    })
  })
}

/**
 * @return all registered teams as global team ids, best first
 */
function seededTeams () {
  const ranking = State.tournaments.getGlobalRanking(State.teams.length)
  return ranking.displayOrder.slice(0)
}

class TemplatePlanView extends View {
  constructor ($view) {
    super(State.plan, $view)
    this.$choice = this.$view.find('.templatechoice')
    this.$list = this.$view.find('.templatelist')
    this.$progress = this.$view.find('.templateprogress')
    this.$name = this.$view.find('.templatename')
    this.$steps = this.$view.find('.templatesteps')
    this.$start = this.$view.find('button.planstep')
    this.$round = this.$view.find('button.planround')
    this.$options = this.$view.find('.planoptions')
    this.$rounds = this.$view.find('input.planrounds')
    this.$kosize = this.$view.find('select.plankosize')
    this.$schedule = this.$view.find('.planschedule')
    this.$hint = this.$view.find('.stephint')

    this.initTemplates()
    this.initOptions()
    const view = this
    this.$start.click(function () {
      advanceToNextStep(State.plan, seededTeams(), State.tournaments)
      view.update()
    })
    this.$round.click(function () {
      startPendingRounds(State.plan, State.tournaments)
      view.update()
    })
    this.$view.find('button.cancelplan').click(function () {
      if (window.confirm(Strings.confirm_plan_cancel)) {
        State.plan.clear()
      }
    })

    State.teams.registerListener(this)
    State.tournaments.registerListener(this)
    State.melee.registerListener(this)
    this.update()
    // the ranking is only correct once every tournament has been read
    window.setTimeout(function () {
      view.update()
    }, 0)
  }

  /**
   * the two numbers which shape the whole tournament
   */
  initOptions () {
    const view = this
    this.$rounds.attr('min', OPTIONS.rounds.min).attr('max', OPTIONS.rounds.max)
    this.$rounds.parent().find('.optionlabel').text(OPTIONS.rounds.label)
    this.$kosize.parent().find('.optionlabel').text(OPTIONS.kosize.label)
    OPTIONS.kosize.values.forEach(function (value) {
      view.$kosize.append($('<option>').attr('value', value).text(value))
    })
    this.$rounds.on('change', function () {
      State.plan.setOption('rounds', Number(view.$rounds.val()))
      view.update()
    })
    this.$kosize.on('change', function () {
      State.plan.setOption('kosize', Number(view.$kosize.val()))
      view.update()
    })
  }

  /**
   * one button per template, with its description next to it
   */
  initTemplates () {
    const view = this
    availableTemplates().forEach(function (template) {
      const $button = $('<button>').text(template.name)
        .attr('data-template', template.id)
      const $entry = $('<li>').append($button)
        .append($('<span>').addClass('description').text(template.description))
      $button.click(function () {
        State.plan.start(template.id)
        view.update()
      })
      view.$list.append($entry)
    })
  }

  /**
   * @return true when a template may still be picked: a template
   *         seeds every registered team, so it has to be chosen
   *         before the first phase is played
   */
  canChoose () {
    return State.tournaments.length === 0 && !State.melee.get()
  }

  update () {
    const plan = State.plan
    const template = plan.getTemplate()
    this.$view.toggleClass('hidden',
      (!template && !this.canChoose()) || availableTemplates().length === 0)
    this.$choice.toggleClass('hidden', !!template)
    this.$progress.toggleClass('hidden', !template)
    if (!template) {
      this.updateTemplateButtons()
      return
    }
    this.$name.text(template.name)
    this.updateOptions(template)
    this.updateSteps(template)
    this.updateStartButton(template)
    this.$round.toggleClass('hidden', !canStartRound(State.plan, State.tournaments))
  }

  updateTemplateButtons () {
    const numTeams = State.teams.length
    this.$list.find('button[data-template]').each(function () {
      const $button = $(this)
      const template = availableTemplates().filter(function (candidate) {
        return candidate.id === $button.attr('data-template')
      })[0]
      $button.prop('disabled', numTeams < minTeams(template, undefined))
    })
    this.$view.find('.hint').text(numTeams < 2
      ? 'Melde zuerst die Teams an, dann steht der Ablauf zur Wahl.'
      : TemplatePlanView.prototype.HINT)
  }

  /**
   * the options, and what they add up to
   */
  updateOptions (template) {
    const options = State.plan.options
    this.$options.toggleClass('hidden', !State.plan.isConfigurable())
    this.$rounds.val(options.rounds)
    this.$kosize.val(options.kosize)
    const plan = schedule(template, options)
    const settings = State.plan.isConfigurable()
      // the numbers are in the fields right above
      ? ''
      : options.rounds + ' ' + OPTIONS.rounds.label + ' · KO-Turniere mit ' +
        options.kosize + ' Teams · '
    this.$schedule.text(settings + 'insgesamt ' + plan.rounds +
      ' Runden · höchstens ' + plan.matches + ' Begegnungen pro Team')
  }

  /**
   * the steps as a list, with the phases they have created
   */
  updateSteps (template) {
    const played = State.plan.tournamentsByStep(State.tournaments)
    const next = State.plan.nextStep()
    this.$steps.empty()
    const $steps = this.$steps
    const groupCount = (template.steps.filter(function (step) {
      return step.kind === 'groups'
    })[0] || {}).groups || 1
    template.steps.forEach(function (step, index) {
      const tournaments = played[index] || []
      const $step = $('<li>').text(
        stepLabel(template, index, State.plan.options, groupCount))
      if (tournaments.length) {
        const names = tournaments.map(function (tournament) {
          return tournament.getName().get()
        })
        const states = tournaments.map(function (tournament) {
          return tournament.getState().get()
        })
        const done = states.every(function (state) {
          return state === 'finished'
        })
        const waiting = states.every(function (state) {
          return state === 'initial'
        })
        $step.addClass(done ? 'done' : 'running')
        $step.append($('<span>').addClass('phases')
          .text(names.join(', ') + ' — ' + (done
            ? 'beendet'
            : (waiting ? 'ausgelost' : 'läuft'))))
      } else if (index === next) {
        $step.addClass('next')
      }
      $steps.append($step)
    })
  }

  updateStartButton (template) {
    const next = State.plan.nextStep()
    if (next === -1) {
      this.$start.addClass('hidden')
      this.$hint.text('Alle Phasen sind ausgelost.')
      return
    }
    const step = template.steps[next]
    const teams = seededTeams()
    const ready = canAdvance(State.plan, teams, State.tournaments)
    this.$start.removeClass('hidden').text(step.action || step.label)
      .prop('disabled', !ready)
    if (!ready) {
      const minimum = minTeams(template, State.plan.options)
      this.$hint.text(teams.length < minimum
        ? 'Dafür fehlen noch Teams: mindestens ' + minimum + '.'
        : this.waitingHint())
      return
    }
    const phases = previewNextStep(State.plan, teams, State.tournaments)
      .map(function (spec) {
        return spec.name + ': ' + spec.teamIDs.length + ' ' + Strings.teamstext
      })
    const unplaced = previewUnplaced(State.plan, teams, State.tournaments)
    if (unplaced.length) {
      phases.push(unplaced.length === 1
        ? 'ein Team bleibt ohne Turnier'
        : unplaced.length + ' Teams bleiben ohne Turnier')
    }
    this.$hint.text(phases.join(' · '))
  }

  /**
   * @return what the previous phases are still waiting for
   */
  waitingHint () {
    const previous = State.plan.tournamentsByStep(State.tournaments)[
      State.plan.nextStep() - 1] || []
    const waiting = previous.every(function (tournament) {
      return tournament.getState().get() === 'initial'
    })
    return waiting
      ? 'Starte zuerst die ausgelosten Phasen.'
      : 'Trage zuerst die offenen Ergebnisse ein.'
  }

  onupdate () {
    this.update()
  }

  onresize () {
    this.update()
  }

  /**
   * the box belongs to the tab, so only the listeners go away
   */
  destroy () {
    Listener.prototype.destroy.call(this)
  }
}

TemplatePlanView.prototype.HINT = 'Eine Vorlage spielt mehrere Phasen ' +
  'nacheinander: Vorrunden, ein Finale der Besten und eine ' +
  'Platzierungsrunde für alle anderen. Jede Phase wird ausgelost, ' +
  'sobald die vorige beendet ist.'

export default TemplatePlanView
