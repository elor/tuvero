import $ from 'jquery'
import View from '../core/view.js'
import ListView from './listview.js'
import State from './state.js'
import CheckBoxView from './checkboxview.js'
import ClassView from '../core/classview.js'
import TournamentRankingView from './tournamentrankingview.js'
import TabsHandle from './tabshandle.js'
import ClosedTournamentCollapseListener from './closedtournamentcollapselistener.js'

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
class RankingTab extends View {
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
    let $template, $container, value

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
    this.rankingabbreviations = State.tabOptions.rankingAbbreviations
    $container = this.$view.find('>.options input.abbreviate')
    this.abbreviateCheckBoxView = new CheckBoxView(this.rankingabbreviations, $container)

    // rankinglist
    $container = this.$view.find('.tournamentlist')
    $template = $container.find('.tournament.template')
    this.tournamentList = new ListView(State.tournaments, $container, $template, TournamentRankingView, State.teams, this.rankingabbreviations)

    // HACK: close tournaments
    this.collapseListener = new ClosedTournamentCollapseListener(this.tournamentList)
  }

  /**
   * show/hide the tab and update it as necessary
   */
  update () {
    let i, isRunning
    isRunning = false
    for (i = 0; !isRunning && i < State.tournaments.length; i += 1) {
      isRunning = State.tournaments.get(i).getState().get() !== 'initial'
    }
    if (isRunning) {
      TabsHandle.show('ranking')
    } else {
      TabsHandle.hide('ranking')
    }
  }

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  onupdate (emitter, event, data) {
    if (emitter !== State.tournaments) {
      this.update()
    }
  }

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  oninsert (emitter, event, data) {
    data.object.getState().registerListener(this)
    this.update()
  }

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  onremove (emitter, event, data) {
    data.object.getState().unregisterListener(this)
    this.update()
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  let $tab
  $tab = $('#tabs > [data-tab="ranking"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new RankingTab($tab)
  }
})
export default RankingTab
