/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/state', './systemlistview',
    './tournamentviewpopulator', './checkboxview', 'core/classview',
    'ui/tabshandle'], function(extend, $, View, State, SystemListView,
    TournamentViewPopulator, CheckBoxView, ClassView, TabsHandle) {
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
  function NewTab($tab) {
    NewTab.superconstructor.call(this, undefined, $tab);

    this.init();

    this.update();

    State.teams.registerListener(this);
  }
  extend(NewTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  NewTab.prototype.init = function() {
    var $view, factory, $templates, value;

    $templates = this.$view.find('.template[data-system]').detach();
    factory = new TournamentViewPopulator($templates);
    $view = this.$view.find('.systemtable');
    view = new SystemListView(State.teams, $view, State.tournaments,
        State.teamsize, factory);

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $view = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $view);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // player names checkbox
    value = State.tabOptions.showNames;
    $view = this.$view.find('>.options input.shownames');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $view);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        'hidenames');

    this.$view.find('.boxview.template').detach();
  };

  /**
   * show/hide the tab and update it as necessary
   */
  NewTab.prototype.update = function() {
    if (State.teams.length < 2) {
      TabsHandle.hide('new');
    } else {
      TabsHandle.show('new');
    }
  };

  /**
   * the number of teams has changed
   */
  NewTab.prototype.onresize = function() {
    this.update();
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="new"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new NewTab($tab);
    }
  });

  return NewTab;
});
