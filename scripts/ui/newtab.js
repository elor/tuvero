import $ from 'jquery';
import View from '../core/view.js';
import State from './state.js';
import SystemListView from './systemlistview.js';
import TournamentViewPopulator from './tournamentviewpopulator.js';

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
class NewTab extends View {
  constructor($tab) {
    super(undefined, $tab);
    this.init();
    this.update();
    State.teams.registerListener(this);
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init() {
    let $view, factory, $templates;
    $templates = this.$view.find('.template[data-system]').detach();
    factory = new TournamentViewPopulator($templates, State.tournaments);
    $view = this.$view.find('.systemtable');
    this.systemListView = new SystemListView(State.teams, $view, State.tournaments, State.teamsize, factory);
    this.$view.find('.boxview.system.template').detach();
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  let $tab;
  $tab = $('#tabs > [data-tab="teams"]');
  if ($tab.length && $('#testmain').length === 0) {
    return new NewTab($tab);
  }
});
export default NewTab;