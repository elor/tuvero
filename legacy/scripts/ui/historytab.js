/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', './state_new',
    'core/valuemodel', './checkboxview', 'core/classview', 'options',
    './tournamenthistoryview'],//
function(extend, $, View, ListView, State, ValueModel, CheckboxView, ClassView,
    Options, TournamentHistoryView) {
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
    this.teamList = new ListView(State.tournaments, $container, $template,
        TournamentHistoryView, State.teams, State.teamsize);

    // name maxwidth checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckboxView = new CheckboxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // player names checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.shownames');
    this.maxwidthCheckboxView = new CheckboxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        'hidenames');

    // list/table selection checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.showtable');
    this.showtableCheckboxView = new CheckboxView(value, $container);
    this.showtableClassView = new ClassView(value, this.$view, 'showtable',
        'showmatchtable');

    // hidefinished checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.hidefinished');
    this.hidefinishedCheckboxView = new CheckboxView(value, $container);
    this.hidefinishedClassView = new ClassView(value, this.$view,
        'hidefinished');
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
