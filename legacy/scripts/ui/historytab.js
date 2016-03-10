/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', 'ui/state',
    './checkboxview', 'core/classview', './tournamenthistoryview',
    './closedtournamentcollapselistener', 'ui/tabshandle'], function(extend, $,
    View, ListView, State, CheckBoxView, ClassView, TournamentHistoryView,
    ClosedTournamentCollapseListener, TabsHandle) {
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
  function HistoryTab($tab) {
    HistoryTab.superconstructor.call(this, undefined, $tab);

    this.init();

    this.update();

    State.tournaments.registerListener(this);
  }
  extend(HistoryTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  HistoryTab.prototype.init = function() {
    var $template, $container, value;

    // tournamentlist
    $container = this.$view.find('.tournamentlist');
    $template = $container.find('.tournament.template');
    this.tournamentList = new ListView(State.tournaments, $container,
        $template, TournamentHistoryView, State.teams, State.teamsize,
        State.tabOptions.showNames);

    // HACK: close tournaments
    this.collapseListener = new ClosedTournamentCollapseListener(
        this.tournamentList);

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $container = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // player names checkbox
    value = State.tabOptions.showNames;
    $container = this.$view.find('>.options input.shownames');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        'hidenames');

    // list/table selection checkbox
    value = State.tabOptions.showMatchTables;
    $container = this.$view.find('>.options input.showtable');
    this.showtableCheckBoxView = new CheckBoxView(value, $container);
    this.showtableClassView = new ClassView(value, this.$view,
        'showmatchtable', 'showtable');

    // hidefinished checkbox
    value = State.tabOptions.hideFinishedGroups;
    $container = this.$view.find('>.options input.hidefinished');
    this.hidefinishedCheckBoxView = new CheckBoxView(value, $container);
    this.hidefinishedClassView = new ClassView(value, this.$view,
        'hidefinished');
  };

  /**
   * show/hide the tab and update it as necessary
   */
  HistoryTab.prototype.update = function() {
    var i, hasHistory;

    hasHistory = false;

    for (i = 0; !hasHistory && i < State.tournaments.length; i += 1) {
      hasHistory = State.tournaments.get(i).getCombinedHistory().length > 0;

      if (hasHistory) {
        break;
      }
    }

    if (hasHistory) {
      TabsHandle.show('history');
    } else {
      TabsHandle.hide('history');
    }
  };

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  HistoryTab.prototype.onresize = function(emitter, event, //
  data) {
    this.update();
  };

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  HistoryTab.prototype.oninsert = function(emitter, event, //
  data) {
    if (emitter === State.tournaments) {
      data.object.getCombinedHistory().registerListener(this);
    }
    this.update();
  };

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  HistoryTab.prototype.onremove = function(emitter, event, //
  data) {
    if (emitter === State.tournaments) {
      data.object.getHistory().unregisterListener(this);
    }
    this.update();
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="history"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new HistoryTab($tab);
    }
  });

  return HistoryTab;
});
