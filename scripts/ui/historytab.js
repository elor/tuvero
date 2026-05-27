import $ from 'jquery'
import View from '../core/view.js'
import ListView from './listview.js'
import State from './state.js'
import CheckBoxView from './checkboxview.js'
import ClassView from '../core/classview.js'
import TournamentHistoryView from './tournamenthistoryview.js'
import ClosedTournamentCollapseListener from './closedtournamentcollapselistener.js'
import TabsHandle from './tabshandle.js'
import ValueModel from '../core/valuemodel.js'

/**
 * represents a whole team tab
 *
 * TODO write a TabView superclass with common functions
 *
 * TODO isolate common tab-related function
 *
 * @param $tab
 *          the tab DOM element
 */
class HistoryTab extends View {
  constructor ($tab) {
    super(undefined, $tab)
    this.init()
    this.update()
    State.tournaments.registerListener(this)
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init () {
    let $container, value
    const fullwidth = new ValueModel()
    fullwidth.dependencies = [State.tabOptions.showNames, State.tabOptions.showTeamName]
    fullwidth.onupdate = function () {
      this.set(this.dependencies.some(function (dep) {
        return dep.get()
      }))
    }
    fullwidth.dependencies.forEach(function (dep) {
      dep.registerListener(fullwidth)
    })
    fullwidth.onupdate()

    // tournamentlist
    $container = this.$view.find('.tournamentlist')
    const $template = $container.find('.tournament.template')
    this.tournamentList = new ListView(State.tournaments, $container, $template, TournamentHistoryView, State.teams, State.teamsize, fullwidth)

    // HACK: close tournaments
    this.collapseListener = new ClosedTournamentCollapseListener(this.tournamentList)

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth
    $container = this.$view.find('>.options input.maxwidth')
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container)
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth', 'nomaxwidth')

    // player names checkbox
    value = State.tabOptions.showNames
    $container = this.$view.find('>.options input.shownames')
    this.showNamesCheckBoxView = new CheckBoxView(value, $container)
    this.showNamesClassView = new ClassView(value, this.$view, undefined, 'hidenames')

    // team names checkbox
    value = State.tabOptions.showTeamName
    $container = this.$view.find('>.options input.showteamname')
    this.showTeamNameCheckBoxView = new CheckBoxView(value, $container)
    this.showTeamNameClassView = new ClassView(value, this.$view, undefined, 'hideteamname')

    // list/table selection checkbox
    value = State.tabOptions.showMatchTables
    $container = this.$view.find('>.options input.showtable')
    this.showtableCheckBoxView = new CheckBoxView(value, $container)
    this.showtableClassView = new ClassView(value, this.$view, 'showmatchtable', 'showtable')

    // hidefinished checkbox
    value = State.tabOptions.hideFinishedGroups
    $container = this.$view.find('>.options input.hidefinished')
    this.hidefinishedCheckBoxView = new CheckBoxView(value, $container)
    this.hidefinishedClassView = new ClassView(value, this.$view, 'hidefinished')
  }

  /**
   * show/hide the tab and update it as necessary
   */
  update () {
    let i, hasHistory
    hasHistory = false
    for (i = 0; !hasHistory && i < State.tournaments.length; i += 1) {
      hasHistory = State.tournaments.get(i).getCombinedHistory().length > 0
      if (hasHistory) {
        break
      }
    }
    if (hasHistory) {
      TabsHandle.show('history')
    } else {
      TabsHandle.hide('history')
    }
  }

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  onresize (
    emitter,
    event,
    //
    data
  ) {
    this.update()
  }

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  oninsert (
    emitter,
    event,
    //
    data
  ) {
    if (emitter === State.tournaments) {
      data.object.getCombinedHistory().registerListener(this)
    }
    this.update()
  }

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  onremove (
    emitter,
    event,
    //
    data
  ) {
    if (emitter === State.tournaments) {
      data.object.getHistory().unregisterListener(this)
    }
    this.update()
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
    const $tab = $('#tabs > [data-tab="history"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new HistoryTab($tab)
  }
})
export default HistoryTab
