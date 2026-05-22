/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import $ from 'jquery';
import View from '../core/view.js';
import ListView from './listview.js';
import State from './state.js';
import CheckBoxView from './checkboxview.js';
import ClassView from '../core/classview.js';
import TournamentMatchesView from './tournamentmatchesview.js';
import TabsHandle from './tabshandle.js';
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
function GamesTab($tab) {
  GamesTab.superconstructor.call(this, undefined, $tab);
  this.init();
  this.update();
  State.tournaments.registerListener(this);
}
extend(GamesTab, View);

/**
 * initialize the tab functionality
 *
 * TODO maybe split it into multiple autodetected functions?
 */
GamesTab.prototype.init = function () {
  let $template, $container, value;

  // tournamentlist
  $container = this.$view.find('.tournamentlist');
  $template = $container.find('.tournament.template');
  this.tournamentList = new ListView(State.tournaments, $container, $template, TournamentMatchesView, State.teams, State.teamsize);

  // name maxwidth checkbox
  value = State.tabOptions.nameMaxWidth;
  $container = this.$view.find('>.options input.maxwidth');
  this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
  this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth', 'nomaxwidth');

  // player names checkbox
  value = State.tabOptions.showNames;
  $container = this.$view.find('>.options input.shownames');
  this.showNamesCheckBoxView = new CheckBoxView(value, $container);
  this.showNamesClassView = new ClassView(value, this.$view, undefined, 'hidenames');

  // team names checkbox
  value = State.tabOptions.showTeamName;
  $container = this.$view.find('>.options input.showteamname');
  this.showTeamNameCheckBoxView = new CheckBoxView(value, $container);
  this.showTeamNameClassView = new ClassView(value, this.$view, undefined, 'hideteamname');
};

/**
 * show/hide the tab and update it as necessary
 */
GamesTab.prototype.update = function () {
  let i, isRunning;
  isRunning = false;
  for (i = 0; !isRunning && i < State.tournaments.length; i += 1) {
    isRunning = State.tournaments.get(i).getState().get() === 'running';
  }
  if (isRunning) {
    TabsHandle.show('games');
  } else {
    TabsHandle.hide('games');
  }
};

/**
 * a tournament state has been changed
 *
 * @param emitter
 * @param event
 * @param data
 */
GamesTab.prototype.onupdate = function (emitter, event,
//
data) {
  if (emitter !== State.tournaments) {
    this.update();
  }
};

/**
 * a tournament has been added
 *
 * @param emitter
 * @param event
 * @param data
 */
GamesTab.prototype.oninsert = function (emitter, event,
//
data) {
  data.object.getState().registerListener(this);
  this.update();
};

/**
 * a tournament has been removed
 *
 * @param emitter
 * @param event
 * @param data
 */
GamesTab.prototype.onremove = function (emitter, event,
//
data) {
  data.object.getState().unregisterListener(this);
  this.update();
};

// FIXME CHEAP HACK AHEAD
$(function ($) {
  let $tab;
  $tab = $('#tabs > [data-tab="games"]');
  if ($tab.length && $('#testmain').length === 0) {
    return new GamesTab($tab);
  }
});
export default GamesTab;