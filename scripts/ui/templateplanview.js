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
import TEMPLATES from '../tournament/templates.js'
import { canStartNextStep, startNextStep, previewNextStep } from '../tournament/templaterunner.js'
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
    this.$start = this.$view.find('button.startstep')
    this.$hint = this.$view.find('.stephint')

    this.initTemplates()
    const view = this
    this.$start.click(function () {
      startNextStep(State.plan, seededTeams(), State.tournaments)
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
    this.updateSteps(template)
    this.updateStartButton(template)
  }

  updateTemplateButtons () {
    const numTeams = State.teams.length
    this.$list.find('button[data-template]').each(function () {
      const $button = $(this)
      const template = availableTemplates().filter(function (candidate) {
        return candidate.id === $button.attr('data-template')
      })[0]
      $button.prop('disabled', numTeams < template.minteams)
    })
    this.$view.find('.hint').text(numTeams < 2
      ? 'Melde zuerst die Teams an, dann steht der Ablauf zur Wahl.'
      : TemplatePlanView.prototype.HINT)
  }

  /**
   * the steps as a list, with the phases they have created
   */
  updateSteps (template) {
    const played = State.plan.tournamentsByStep(State.tournaments)
    const next = State.plan.nextStep()
    this.$steps.empty()
    const $steps = this.$steps
    template.steps.forEach(function (step, index) {
      const tournaments = played[index] || []
      const $step = $('<li>').text(step.label)
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
    const ready = canStartNextStep(State.plan, teams, State.tournaments)
    this.$start.removeClass('hidden').text(step.label).prop('disabled', !ready)
    if (!ready) {
      this.$hint.text(teams.length < template.minteams
        ? 'Dafür fehlen noch Teams: mindestens ' + template.minteams + '.'
        : this.waitingHint())
      return
    }
    this.$hint.text(previewNextStep(State.plan, teams, State.tournaments)
      .map(function (spec) {
        return spec.name + ': ' + spec.teamIDs.length + ' ' + Strings.teamstext
      }).join(' · '))
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
      ? 'Starte und beende zuerst die ausgelosten Phasen.'
      : 'Beende zuerst die laufenden Phasen.'
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
